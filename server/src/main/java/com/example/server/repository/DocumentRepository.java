package com.example.server.repository;

import com.example.server.model.UserDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DocumentRepository extends MongoRepository<UserDocument, String> {
    @Query("{ 'userId': ?0 }")
    List<UserDocument> findByUserId(String userId);
}