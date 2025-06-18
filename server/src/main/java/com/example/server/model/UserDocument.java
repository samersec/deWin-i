package com.example.server.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Date;

@Document(collection = "Documents")
public class UserDocument {
    @Id
    private String _id;

    @NotBlank
    private String titre;

    @NotBlank
    private String type;

    @NotBlank
    private String urlFichier;

    @NotNull
    private Date dateUpload;

    @Indexed
    @NotBlank
    private String userId;

    public UserDocument() {
    }

    public UserDocument(String titre, String type, String fileUrl, Date dateDocument, String userId) {
        this.titre = titre;
        this.type = type;
        this.urlFichier = fileUrl;
        this.dateUpload = dateDocument;
        this.userId = userId;
    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUrlFichier() {
        return urlFichier;
    }

    public void setUrlFichier(String urlFichier) {
        this.urlFichier = urlFichier;
    }

    public Date getDateUpload() {
        return dateUpload;
    }

    public void setDateUpload(Date dateUpload) {
        this.dateUpload = dateUpload;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    @Override
    public String toString() {
        return "UserDocument{" +
                "_id='" + _id + '\'' +
                ", titre='" + titre + '\'' +
                ", type='" + type + '\'' +
                ", urlFichier='" + urlFichier + '\'' +
                ", dateUpload=" + dateUpload +
                '}';
    }
}