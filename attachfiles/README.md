# Little Star App - File Attachments

This directory contains all files uploaded to the Little Star app, organized in a clean folder structure.

## 📁 Folder Structure

```
attachfiles/
├── health-records/     # Medical documents, lab results, vaccination records
├── memories/          # Photos, videos, and memory-related files  
├── activities/        # Activity-related documents and images
└── reports/          # Generated reports and exported data
```

## 📋 File Organization

### Health Records (`/health-records/`)
- **Allowed Types**: PDF, JPG, JPEG, PNG, DOC, DOCX, TXT
- **Contents**: Medical appointments, vaccination certificates, lab results, prescriptions
- **Naming**: `YYYY-MM-DDTHH-MM-SS_sanitized-filename.ext`

### Memories (`/memories/`)
- **Allowed Types**: JPG, JPEG, PNG, GIF, MP4, MOV, PDF
- **Contents**: Photos, videos, milestone documentation
- **Naming**: `YYYY-MM-DDTHH-MM-SS_sanitized-filename.ext`

### Activities (`/activities/`)
- **Allowed Types**: JPG, JPEG, PNG, PDF, DOC, DOCX
- **Contents**: Activity photos, certificates, artwork scans
- **Naming**: `YYYY-MM-DDTHH-MM-SS_sanitized-filename.ext`

### Reports (`/reports/`)
- **Allowed Types**: PDF, CSV, XLSX, DOC, DOCX
- **Contents**: Generated growth reports, health summaries, exported data
- **Naming**: `YYYY-MM-DDTHH-MM-SS_sanitized-filename.ext`

## 🔒 File Handling Features

- **Automatic Organization**: Files are automatically sorted into appropriate folders
- **Unique Naming**: Timestamp-based naming prevents filename conflicts
- **Type Validation**: Only approved file types are accepted for each category
- **Size Tracking**: File sizes are tracked and displayed
- **Metadata Storage**: Original filename, upload date, and category are preserved

## 🛠️ Technical Implementation

Files are processed through the `/src/lib/fileHandler.ts` utility which:
- Validates file types based on category
- Generates unique, sanitized filenames
- Simulates file upload (ready for server/cloud integration)
- Returns structured metadata for database storage

## 🔄 Future Enhancements

- Cloud storage integration (AWS S3, Google Drive, etc.)
- File compression for large images
- Thumbnail generation for photos/videos
- File sharing and export capabilities
- Advanced search and filtering