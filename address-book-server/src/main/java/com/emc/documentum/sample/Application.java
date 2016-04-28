package com.emc.documentum.sample;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

/**
 * Spring Boot Address Book Contacts Web Application Server
 *
 * @author Simon O'Brien
 */
@Configuration
@ComponentScan(basePackages = {"com.emc.documentum.springdata", "com.emc.documentum.sample"})
@EnableAutoConfiguration
@EnableWebMvc
public class Application {

    @Autowired
    private Environment environment;

    /**
     * Repository name bean
     *
     * @return repository name
     */
    @Bean
    @Qualifier("repositoryName")
    public String getRepositoryName() {
        return environment.getProperty("repository.name");
    }

    /**
     * Repository username bean
     *
     * @return repository username
     */
    @Bean
    @Qualifier("repositoryUsername")
    public String getRepositoryUsername() {
        return environment.getProperty("repository.username");
    }

    /**
     * Repository password bean
     *
     * @return repository password
     */
    @Bean
    @Qualifier("repositoryPassword")
    public String getRepositoryPassword() {
        return environment.getProperty("repository.password");
    }

    /**
     * Main method
     *
     * @param args command line args
     */
    public static void main(String[] args){
        SpringApplication.run(Application.class, args);
    }
}
