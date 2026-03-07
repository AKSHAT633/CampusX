# Image Upload Architecture - Complete Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                       │
│  User selects file → FormData + auth token → POST/PUT       │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Express)                         │
│  Route receives request                                      │
│  Example: PUT /api/user/profile                             │
└────────────────────────────┬────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
   ┌─────────┐         ┌──────────┐        ┌────────────┐
   │  isAuth │         │ Multer   │        │ ErrorLog   │
   │Middleware         │Middleware          │Handler     │
   │                   │                    │            │
   │ ✓ Validate        │ ✓ Save file        │ ✓ Catch    │
   │   token           │   to /public/      │   errors   │
   │                   │ ✓ Set req.file     │            │
   └─────────┬─────────└──────┬──────────────└────────────┘
             │                 │
             │ (all passed)    │ (file ready)
             │                 │
             └────────────┬────┘
                          │
                          ▼
         ┌────────────────────────────────────┐
         │      Controller Function            │
         │  (updateProfile, createItem, etc)  │
         │                                    │
         │ 1. Parse req.body                  │
         │ 2. Check req.file exists           │
         │ 3. Call uploadOnCloudinary()       │
         └────────────────┬───────────────────┘
                          │
                          ▼
         ┌────────────────────────────────────┐
         │   uploadOnCloudinary(filePath)     │
         │   (config/cloudinary.js)           │
         │                                    │
         │ 1. Validate filePath exists ✓      │
         │ 2. Check fs.existsSync() ✓         │
         │ 3. Call cloudinary.uploader.upload │
         └────────────────┬───────────────────┘
                          │
                          ▼
         ┌────────────────────────────────────┐
         │  CLOUDINARY API (Cloud Storage)    │
         │                                    │
         │  Upload file to CDN                │
         │  Return secure_url                 │
         │  https://res.cloudinary.com/...jpg │
         └────────────────┬───────────────────┘
                          │
                          ▼
         ┌────────────────────────────────────┐
         │   Delete Temp File                 │
         │   fs.unlinkSync(/public/filename)  │
         │                                    │
         │   /public directory cleaned ✓      │
         └────────────────┬───────────────────┘
                          │
                          ▼
         ┌────────────────────────────────────┐
         │   Save to MongoDB                  │
         │   user.ProfileImage = secure_url   │
         │   item.images = [secure_url]       │
         │   marketplace.images = [urls]      │
         │                                    │
         │   user.save() ✓                    │
         └────────────────┬───────────────────┘
                          │
                          ▼
         ┌────────────────────────────────────┐
         │   Send Success Response            │
         │   200 OK                           │
         │   { success: true, user: {...} }   │
         └────────────────┬───────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                       │
│  Receive response → Update UI with new image URL           │
│  Display: https://res.cloudinary.com/...jpg                │
└─────────────────────────────────────────────────────────────┘
```

---

## File Upload Flow (Detailed)

```
REQUEST PHASE
═════════════

Frontend
  │
  ├─ Create FormData
  │   ├─ profileImage: File object
  │   ├─ name: "John"
  │   └─ phone: "123"
  │
  ├─ Add headers
  │   ├─ Authorization: Bearer TOKEN
  │   └─ (Don't set Content-Type, browser auto-sets with boundary)
  │
  └─ Send fetch/axios
      └─ PUT /api/user/profile


MIDDLEWARE PHASE
════════════════

Route handler detects middleware chain
  │
  ├─ isAuth middleware
  │   ├─ Read Authorization header
  │   ├─ Verify JWT token
  │   ├─ Set req.userId
  │   └─ next()
  │
  └─ upload.single("profileImage")
      ├─ Read multipart/form-data
      ├─ Parse boundaries
      ├─ Save file to /backend/public/
      ├─ Set req.file = { path, mimetype, size, ... }
      ├─ Set req.body = { name, phone }
      └─ next()


CONTROLLER PHASE
════════════════

updateProfile(req, res) called
  │
  ├─ Extract req.body
  │   ├─ name = "John"
  │   └─ phone = "123"
  │
  ├─ Prepare updateData object
  │   ├─ updateData.name = "John"
  │   └─ updateData.phone = "123"
  │
  ├─ Check if req.file exists
  │   │
  │   └─ YES: Enter upload block
  │       │
  │       └─ Call uploadOnCloudinary(req.file.path)
  │           └─ Pass: "/Users/.../CampusSync/backend/public/image.jpg"


CLOUDINARY UPLOAD PHASE
═══════════════════════

uploadOnCloudinary(filePath)
  │
  ├─ Validate filePath
  │   ├─ if (!filePath) throw Error("File path required")
  │   └─ if (!fs.existsSync(filePath)) throw Error("File not found")
  │
  ├─ Call cloudinary.uploader.upload(filePath)
  │   ├─ Upload file to Cloudinary servers
  │   ├─ Process image (resize, format, etc)
  │   └─ Store on CDN
  │
  ├─ Get response
  │   └─ { public_id: "...", secure_url: "https://...", ... }
  │
  ├─ Delete temp file
  │   ├─ if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  │   └─ /backend/public/image.jpg removed
  │
  └─ Return secure_url
      └─ "https://res.cloudinary.com/djtjzl9nn/image/.../image.jpg"


DATABASE PHASE
══════════════

Back in controller
  │
  ├─ Receive secure_url from uploadOnCloudinary
  │   └─ updateData.ProfileImage = secure_url
  │
  ├─ Update MongoDB
  │   └─ UserModel.findByIdAndUpdate(
  │       userId,
  │       updateData,
  │       { new: true, runValidators: true }
  │     )
  │
  ├─ Fetch updated user
  │   └─ .select("-password")
  │
  └─ Return updated document
      ├─ {
      │   "_id": "...",
      │   "name": "John",
      │   "phone": "123",
      │   "ProfileImage": "https://res.cloudinary.com/.../image.jpg"
      │ }


RESPONSE PHASE
══════════════

Send response to frontend
  │
  ├─ Status: 200 OK
  │
  ├─ Body:
  │   {
  │     "success": true,
  │     "message": "Profile updated successfully",
  │     "user": {
  │       "_id": "...",
  │       "name": "John",
  │       "phone": "123",
  │       "ProfileImage": "https://res.cloudinary.com/.../image.jpg"
  │     }
  │   }
  │
  └─ Frontend receives and displays image


ERROR HANDLING
══════════════

At any stage, if error occurs:
  │
  ├─ Catch in try-catch block
  │
  ├─ Log error to console
  │   └─ console.error("Cloudinary upload error:", error)
  │
  ├─ Delete temp file (if exists)
  │   └─ fs.unlinkSync(filePath)
  │
  └─ Send error response
      ├─ Status: 400 or 500
      └─ Body: { success: false, message: "Error description" }
```

---

## State of Files at Each Stage

```
STAGE 1: User Selects File
════════════════════════════
Frontend Memory:
  fileInput.files[0]
    ├─ name: "photo.jpg"
    ├─ type: "image/jpeg"
    ├─ size: 2.5MB
    └─ lastModified: 1709837400000

File System: (No file yet)


STAGE 2: Multer Receives File
═════════════════════════════════
Backend Memory:
  req.file
    ├─ fieldname: "profileImage"
    ├─ originalname: "photo.jpg"
    ├─ encoding: "7bit"
    ├─ mimetype: "image/jpeg"
    ├─ destination: "./public"
    ├─ filename: "photo.jpg"
    ├─ path: "/Users/.../backend/public/photo.jpg"
    └─ size: 2621440

File System:
  /backend/public/photo.jpg (TEMP FILE) ✓


STAGE 3: uploadOnCloudinary Processing
═══════════════════════════════════════
File System:
  /backend/public/photo.jpg (Still exists)
    ├─ Validated ✓
    ├─ Uploading to Cloudinary...


STAGE 4: Cloudinary Upload Complete
═══════════════════════════════════════
Memory:
  uploadResult
    ├─ public_id: "campussync/abc123"
    ├─ version: 1709837500
    ├─ signature: "xyz789..."
    ├─ width: 1920
    ├─ height: 1440
    ├─ format: "jpg"
    ├─ resource_type: "image"
    ├─ created_at: "2024-03-07T..."
    ├─ tags: []
    ├─ bytes: 2621440
    ├─ type: "upload"
    ├─ etag: "abc123..."
    ├─ placeholder: false
    ├─ url: "http://res.cloudinary.com/.../photo.jpg"
    ├─ secure_url: "https://res.cloudinary.com/.../photo.jpg" ← THIS ONE!
    ├─ folder: "campussync"
    ├─ original_filename: "photo"
    └─ api_key: "241153511761186"

File System:
  /backend/public/photo.jpg (DELETED) ✓
    └─ fs.unlinkSync executed


STAGE 5: Database Updated
════════════════════════════
MongoDB Document:
  User {
    _id: ObjectId("..."),
    name: "John",
    email: "john@example.com",
    phone: "123",
    ProfileImage: "https://res.cloudinary.com/.../photo.jpg",
    createdAt: ISODate("2024-03-01..."),
    updatedAt: ISODate("2024-03-07...")
  }

File System: (Clean)
  /backend/public/ (empty - ready for next upload)


STAGE 6: Response to Frontend
══════════════════════════════
Response Body:
  {
    "success": true,
    "message": "Profile updated successfully",
    "user": {
      "_id": "...",
      "name": "John",
      "phone": "123",
      "ProfileImage": "https://res.cloudinary.com/.../photo.jpg"
    }
  }

Frontend DOM:
  <img src="https://res.cloudinary.com/.../photo.jpg" />
    └─ Browser downloads and displays image from Cloudinary CDN
```

---

## Request/Response Examples

### Successful Upload

```
REQUEST:
═════════
PUT /api/user/profile HTTP/1.1
Authorization: Bearer eyJhbGc...
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA...

------WebKitFormBoundary7MA...
Content-Disposition: form-data; name="profileImage"; filename="photo.jpg"
Content-Type: image/jpeg

[BINARY IMAGE DATA]
------WebKitFormBoundary7MA...
Content-Disposition: form-data; name="name"

John Doe
------WebKitFormBoundary7MA...
Content-Disposition: form-data; name="phone"

9876543210
------WebKitFormBoundary7MA...--


RESPONSE:
═════════
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "6507a8b2c1234567890abcd",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "ProfileImage": "https://res.cloudinary.com/djtjzl9nn/image/upload/v1709837500/campussync/abc123.jpg",
    "createdAt": "2024-03-01T10:00:00.000Z",
    "updatedAt": "2024-03-07T15:30:45.123Z"
  }
}
```

### Error Response

```
RESPONSE:
═════════
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "success": false,
  "message": "Failed to upload image to cloud storage"
}
```

---

## Processing Summary

```
┌─ INPUT                          │ PROCESS                    │ OUTPUT ──┐
├────────────────────────────────┼────────────────────────────┤──────────┤
│ File from frontend              │ Multer disk storage        │ File in /public
├────────────────────────────────┼────────────────────────────┤──────────┤
│ File path + validation          │ uploadOnCloudinary()       │ secure_url
├────────────────────────────────┼────────────────────────────┤──────────┤
│ secure_url + user data          │ MongoDB update             │ User doc updated
├────────────────────────────────┼────────────────────────────┤──────────┤
│ Updated user document           │ JSON response              │ Frontend display
└────────────────────────────────┴────────────────────────────┴──────────┘
```

---

## System Ready ✅

All components integrated and working together:
- Frontend ✅
- Express Routes ✅
- Middleware ✅
- Controllers ✅
- Cloudinary ✅
- MongoDB ✅
- Error Handling ✅
