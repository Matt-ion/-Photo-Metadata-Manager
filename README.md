# Photo Metadata Manager

Photo Metadata Manager is a web application designed to help users upload, annotate, and organize their images. The application allows users to:
- Upload single or multiple images.
- Add metadata such as who is in the photo, where and when it was taken.
- Use AI-powered tools like Google Lens for location identification.
- Write notes for each image, akin to writing on the back of a photo in a photo album.
- Organize images into albums.

## Features
- **Image Upload**: Upload one or multiple images at a time.
- **Metadata Management**: Annotate images with custom metadata and notes.
- **AI Integration**: Utilize AI to identify photo locations when unknown.
- **Albums**: Organize photos into user-defined albums.
- **Export Options (Planned)**: Export albums and metadata in JSON, CSV, or PDF formats.

## Technologies
- **Backend**: Django, Django REST Framework.
- **Frontend**: ReactJS, Material-UI.
- **Storage**: AWS S3 or local storage during development.
- **AI Integration**: Google Cloud Vision API for metadata enhancement.

## Getting Started
### Prerequisites
- Python 3.10+
- Node.js 16+
- PostgreSQL (recommended)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/photo-metadata-manager.git
   cd photo-metadata-manager
