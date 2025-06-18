package com.example.server.controllers;

import com.example.server.model.User;
import com.example.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.util.Optional;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = { "http://localhost:5174",
        "http://localhost:5173" }, allowedHeaders = "*", allowCredentials = "true")
@RestController
@RequestMapping("/api/users")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender emailSender;

    private Map<String, String> resetTokens = new HashMap<>();

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User newUser) {
        Map<String, String> response = new HashMap<>();

        try {
            logger.info("Vérification de l'email: {}", newUser.getEmail());
            if (userRepository.findByEmail(newUser.getEmail()).isPresent()) {
                response.put("message", "Email déjà utilisé");
                response.put("type", "error");
                return ResponseEntity.badRequest().body(response);
            }

            // Hachage du mot de passe avant la sauvegarde
            String hashedPassword = passwordEncoder.encode(newUser.getPassword());
            logger.info("Mot de passe haché avec succès");
            newUser.setPassword(hashedPassword);

            logger.info("Sauvegarde du nouvel utilisateur");
            User savedUser = userRepository.save(newUser);
            logger.info("Utilisateur sauvegardé avec succès. ID: {}", savedUser.getId());

            response.put("message", "Inscription réussie");
            response.put("type", "success");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Erreur lors de l'inscription: {}", e.getMessage());
            response.put("message", "Erreur lors de l'inscription: " + e.getMessage());
            response.put("type", "error");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Map<String, Object> response = new HashMap<>();
        try {
            logger.info("Tentative de connexion pour l'email: {}", loginRequest.getEmail());
            Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());

            if (userOpt.isPresent()) {
                User user = userOpt.get();
                logger.info("Utilisateur trouvé, vérification du mot de passe");

                boolean passwordMatches = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
                logger.info("Résultat de la vérification du mot de passe: {}", passwordMatches);

                if (passwordMatches) {
                    logger.info("Connexion réussie pour l'utilisateur: {}", user.getEmail());
                    Map<String, Object> userData = new HashMap<>();
                    userData.put("id", user.getId());
                    userData.put("email", user.getEmail());
                    userData.put("nom", user.getNom());
                    userData.put("prenom", user.getPrenom());
                    userData.put("role", user.getRole());

                    response.put("message", "Connexion réussie");
                    response.put("type", "success");
                    response.put("user", userData);
                    return ResponseEntity.ok(response);
                }
                logger.warn("Mot de passe incorrect pour l'email: {}", loginRequest.getEmail());
                response.put("message", "Mot de passe incorrect");
                response.put("type", "error");
                return ResponseEntity.badRequest().body(response);
            }

            logger.warn("Aucun utilisateur trouvé avec l'email: {}", loginRequest.getEmail());
            response.put("message", "Email ou mot de passe incorrect");
            response.put("type", "error");
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            logger.error("Erreur lors de la connexion: {}", e.getMessage(), e);
            response.put("message", "Erreur lors de la connexion: " + e.getMessage());
            response.put("type", "error");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        logger.info("Received forgot password request");
        String email = request.get("email");
        Map<String, String> response = new HashMap<>();

        if (email == null || email.trim().isEmpty()) {
            logger.error("Email is null or empty");
            response.put("message", "L'email est requis");
            return ResponseEntity.badRequest().body(response);
        }

        logger.info("Processing forgot password request for email: {}", email);

        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                String token = UUID.randomUUID().toString();
                resetTokens.put(token, email);

                // Préparer l'email
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom("soltanisamer02@gmail.com");
                message.setTo(email);
                message.setSubject("Réinitialisation de mot de passe - Dewini");
                message.setText(
                        "Bonjour " + user.getPrenom() + " " + user.getNom() + ",\n\n" +
                                "Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte Dewini.\n\n"
                                +
                                "Pour réinitialiser votre mot de passe, cliquez sur le lien ci-dessous:\n" +
                                "http://localhost:5173/reset-password?token=" + token + "\n\n" +

                                "Le lien expirera dans 24 heures pour des raisons de sécurité.\n\n" +
                                "Cordialement,\n" +
                                "L'équipe Dewini");

                try {
                    logger.info("Attempting to send email to: {}", email);
                    emailSender.send(message);
                    logger.info("Email sent successfully to: {}", email);

                    response.put("message", "Un email de réinitialisation a été envoyé à " + email);
                    return ResponseEntity.ok(response);
                } catch (Exception e) {
                    logger.error("Failed to send email: {}", e.getMessage());
                    response.put("message", "Erreur lors de l'envoi de l'email. Veuillez réessayer plus tard.");
                    return ResponseEntity.badRequest().body(response);
                }
            } else {
                logger.warn("No user found with email: {}", email);
                // For security reasons, don't reveal if the email exists or not
                response.put("message",
                        "Si cet email est associé à un compte, vous recevrez un lien de réinitialisation.");
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            logger.error("Error processing forgot password request", e);
            response.put("message", "Une erreur est survenue. Veuillez réessayer plus tard.");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("password");
        Map<String, String> response = new HashMap<>();

        logger.info("Tentative de réinitialisation du mot de passe avec le token: {}", token);

        try {
            String email = resetTokens.get(token);
            if (email != null) {
                Optional<User> userOpt = userRepository.findByEmail(email);
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    String hashedPassword = passwordEncoder.encode(newPassword);
                    logger.info("Nouveau mot de passe haché créé pour l'utilisateur: {}", email);

                    user.setPassword(hashedPassword);
                    userRepository.save(user);
                    resetTokens.remove(token);

                    logger.info("Mot de passe réinitialisé avec succès pour l'utilisateur: {}", email);
                    response.put("message", "Mot de passe réinitialisé avec succès");
                    return ResponseEntity.ok(response);
                }
            }
            logger.warn("Token invalide ou expiré: {}", token);
            response.put("message", "Token invalide ou expiré");
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            logger.error("Erreur lors de la réinitialisation du mot de passe", e);
            response.put("message", "Erreur lors de la réinitialisation du mot de passe");
            return ResponseEntity.badRequest().body(response);
        }
    }
}

class LoginRequest {
    private String email;
    private String password;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String testConnection() {
        return "Mongo OK!";
    }
}
