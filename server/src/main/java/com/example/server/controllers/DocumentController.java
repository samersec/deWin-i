package com.example.server.controllers;

import com.example.server.model.UserDocument;
import com.example.server.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.io.File;
import org.springframework.util.StringUtils;
import jakarta.annotation.PostConstruct;
import java.net.URL;
import java.net.HttpURLConnection;
import java.io.InputStream;
import org.springframework.http.HttpStatus;

@CrossOrigin(origins = { "http://localhost:5174", "http://localhost:5173" }, allowCredentials = "true")
@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private static final Logger logger = LoggerFactory.getLogger(DocumentController.class);
    private static final String UPLOAD_DIR = "uploads";
    private Path uploadPath;

    @PostConstruct
    public void init() {
        try {
            // Get the absolute path of the project root directory
            String projectRoot = new File("").getAbsolutePath();
            uploadPath = Paths.get(projectRoot, UPLOAD_DIR).toAbsolutePath().normalize();

            // Create the uploads directory if it doesn't exist
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                logger.info("Created uploads directory at: {}", uploadPath);
            } else {
                logger.info("Uploads directory already exists at: {}", uploadPath);
            }
        } catch (IOException e) {
            logger.error("Could not create upload directory!", e);
        }
    }

    @Autowired
    private DocumentRepository documentRepository;

    @GetMapping
    public ResponseEntity<?> getAllDocuments() {
        try {
            logger.info("Fetching all documents");
            List<UserDocument> documents = documentRepository.findAll();
            logger.info("Found {} documents", documents.size());
            if (!documents.isEmpty()) {
                logger.info("First document: {}", documents.get(0));
            }
            return ResponseEntity.ok(documents);
        } catch (Exception e) {
            logger.error("Error fetching all documents", e);
            return ResponseEntity.internalServerError().body("Error fetching documents: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getDocumentsByUser(@PathVariable String userId) {
        try {
            logger.info("Fetching all documents");
            List<UserDocument> documents = documentRepository.findAll();
            logger.info("Found {} documents", documents.size());
            if (!documents.isEmpty()) {
                logger.info("First document: {}", documents.get(0));
            }
            return ResponseEntity.ok(documents);
        } catch (Exception e) {
            logger.error("Error fetching documents", e);
            return ResponseEntity.internalServerError().body("Error fetching documents: " + e.getMessage());
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("titre") String titre,
            @RequestParam("type") String type,
            @RequestParam("userId") String userId,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        try {
            logger.info("Uploading document for user: {}", userId);

            String urlFichier = "";
            if (file != null && !file.isEmpty()) {
                // Get file extension
                String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
                String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));

                // Generate unique filename
                String newFilename = UUID.randomUUID().toString() + fileExtension;

                // Save file
                Path filePath = uploadPath.resolve(newFilename);
                Files.copy(file.getInputStream(), filePath);

                urlFichier = UPLOAD_DIR + "/" + newFilename;
                logger.info("File saved at: {}", filePath.toString());
            }

            // Create and save document
            UserDocument document = new UserDocument(
                    titre,
                    type,
                    urlFichier,
                    new Date(),
                    userId);

            UserDocument savedDocument = documentRepository.save(document);
            logger.info("Document saved successfully with ID: {}", savedDocument.get_id());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Document uploaded successfully");
            response.put("document", savedDocument);

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            logger.error("Error handling file upload", e);
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error handling file upload: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            logger.error("Error uploading document", e);
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error uploading document: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocument(@PathVariable String id) {
        try {
            logger.info("Deleting document with ID: {}", id);
            documentRepository.deleteById(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Document deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error deleting document with ID: " + id, e);
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error deleting document: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/download/{documentId}")
    public ResponseEntity<?> downloadDocument(@PathVariable String documentId) {
        try {
            logger.info("=== Starting download process for document ID: {} ===", documentId);

            // 1. Get document from database
            UserDocument document = documentRepository.findById(documentId)
                    .orElseThrow(() -> {
                        logger.error("Document not found in database with ID: {}", documentId);
                        return new RuntimeException("Document not found in database");
                    });

            logger.info("Document found in database: {}", document);
            String fileUrl = document.getUrlFichier();
            logger.info("Document URL from database: {}", fileUrl);

            if (fileUrl == null || fileUrl.isEmpty()) {
                logger.error("Document URL is empty for document ID: {}", documentId);
                return ResponseEntity.badRequest().body("Document URL is empty");
            }

            // 2. Check if URL is external
            if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
                logger.info("Processing external URL: {}", fileUrl);

                try {
                    URL url = new URL(fileUrl);
                    HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                    connection.setRequestMethod("GET");
                    connection.setConnectTimeout(5000);
                    connection.setReadTimeout(5000);

                    int responseCode = connection.getResponseCode();
                    logger.info("External URL response code: {}", responseCode);

                    if (responseCode != HttpURLConnection.HTTP_OK) {
                        logger.error("Failed to download from external URL. Response code: {}", responseCode);
                        return ResponseEntity.status(responseCode)
                                .body("Failed to download from external URL. Response code: " + responseCode);
                    }

                    // Get the content type from the response
                    String contentType = connection.getContentType();
                    logger.info("Content type from external URL: {}", contentType);
                    if (contentType == null) {
                        contentType = "application/octet-stream";
                    }

                    // Get the file extension from the URL
                    String fileExtension = "";
                    String path = url.getPath();
                    int lastDotIndex = path.lastIndexOf('.');
                    if (lastDotIndex > 0) {
                        fileExtension = path.substring(lastDotIndex);
                    }
                    logger.info("File extension from URL: {}", fileExtension);

                    // Set the download filename
                    String downloadFilename = document.getTitre() + fileExtension;
                    logger.info("Download filename will be: {}", downloadFilename);

                    // Stream the response
                    InputStream inputStream = connection.getInputStream();

                    return ResponseEntity.ok()
                            .contentType(MediaType.parseMediaType(contentType))
                            .header(HttpHeaders.CONTENT_DISPOSITION,
                                    "attachment; filename=\"" + downloadFilename + "\"")
                            .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "Content-Disposition")
                            .body(inputStream);

                } catch (IOException e) {
                    logger.error("Error accessing external URL: {}", e.getMessage(), e);
                    return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                            .body("Error accessing external URL: " + e.getMessage());
                }
            } else {
                // Handle local file
                logger.info("Processing local file: {}", fileUrl);
                String filename = fileUrl.replace(UPLOAD_DIR + "/", "");
                Path filePath = uploadPath.resolve(filename);
                logger.info("Local file path: {}", filePath);

                if (!Files.exists(filePath)) {
                    logger.error("File does not exist at path: {}", filePath);
                    return ResponseEntity.status(404).body("File not found at: " + filePath);
                }

                Resource resource = new UrlResource(filePath.toUri());
                if (!resource.exists() || !resource.isReadable()) {
                    logger.error("File exists but is not readable at path: {}", filePath);
                    return ResponseEntity.status(500).body("File exists but is not readable");
                }

                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }
                logger.info("Content type for local file: {}", contentType);

                String fileExtension = filename.substring(filename.lastIndexOf("."));
                String downloadFilename = document.getTitre() + fileExtension;
                logger.info("Download filename for local file: {}", downloadFilename);

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + downloadFilename + "\"")
                        .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "Content-Disposition")
                        .body(resource);
            }
        } catch (Exception e) {
            logger.error("Error downloading document: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error downloading document: " + e.getMessage());
        }
    }
}