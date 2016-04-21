package com.emc.documentum.sample.controller;

import com.documentum.fc.common.DfException;
import com.emc.documentum.sample.domain.Contact;
import com.emc.documentum.sample.repositories.ContactRepository;
import com.emc.documentum.springdata.core.Documentum;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.authentication.UserCredentials;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.util.FileSystemUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

/**
 * Controller class to expose the REST services for interacting with contact resources
 *
 * @author Simon O'Brien
 */
@RestController()
@RequestMapping(value="/api/contacts")
public class ContactController {

    @Autowired
    @Qualifier("repositoryName")
    private String repositoryName;

    @Autowired
    @Qualifier("repositoryUsername")
    private String repositoryUsername;

    @Autowired
    @Qualifier("repositoryPassword")
    private String repositoryPassword;

    @Autowired
    private Documentum documentum;

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private ServletContext servletContext;

    /**
     * init post construction
     */
    @PostConstruct
    public void postConstruct(){
        setDCTMCredentials();
    }

    /**
     * Method to map requests to GET contacts
     *
     * @param name if provided only contacts that contain name will be returned
     * @param group if provided only contacts that have the specified group will be returned
     * @return contacts
     * @throws DfException
     */
    @RequestMapping(value={"/",""}, method= RequestMethod.GET, produces = { MediaType.APPLICATION_JSON_VALUE })
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public Iterable<Contact> getAllContacts(@RequestParam(value = "name", required = false) final String name,
                                            @RequestParam(value = "group", required = false) final String group) throws Exception {

        Iterable<Contact> contacts = null;

        /*
         * if the name URI param is supplied then only get contacts where the name contains the
         * value in the URI param, else if the group URI param is supplied then only get contacts
         * that are part of the group specified by the group URI param
         */
        if(StringUtils.hasText(name)) {
            contacts = contactRepository.findByNameContaining(name);
        } else if(StringUtils.hasText(group)) {
            contacts = contactRepository.findByGroups(group);
        } else {
            contacts = contactRepository.findAll();
        }

        return contacts;
    }

    /**
     * Method to map requests to POST a new contact
     *
     * @param contact The contact to create
     * @return The new contact
     * @throws DfException
     */
    @RequestMapping(value="", method=RequestMethod.POST, produces = { MediaType.APPLICATION_JSON_VALUE })
    @ResponseBody
    @ResponseStatus(HttpStatus.CREATED)
    public Contact createContact(@RequestBody @Valid final Contact contact) throws Exception {

        // make sure no ID is set so that new object is created
        contact.setId(null);

        // save the new contact
        contactRepository.save(contact);

        return contact;
    }

    /**
     * Method to map requests to DELETE an existing contact
     *
     * @param id The ID of the contact to delete
     * @throws DfException
     */
    @RequestMapping(value="/{id}", method=RequestMethod.DELETE)
    @ResponseBody
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteContact(@PathVariable String id) throws Exception {

        // delete the contact
        contactRepository.delete(id);
    }

    /**
     * Method to map requests to POST an update to an existing contact
     *
     * @param id The ID of the contact to update
     * @param contact The contact updates
     * @return The updated contact
     * @throws DfException
     */
    @RequestMapping(value="/{id}", method=RequestMethod.POST, produces = { MediaType.APPLICATION_JSON_VALUE })
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public Contact updateContact(@PathVariable String id, @RequestBody @Valid final Contact contact) throws Exception {

        // ensure the contact ID is correctly set
        contact.setId(id);

        // update the contact
        return contactRepository.save(contact);
    }

    /**
     * Method to map requests to POST a picture to a contact
     *
     * @param id The ID of the contact to upload the picture to
     * @param file The picture to store against the contact
     * @throws Exception
     */
    @RequestMapping(value="/{id}/picture", method=RequestMethod.POST)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public void setContactPicture(@PathVariable String id,
                                                @RequestParam("file") MultipartFile file) throws Exception {

        Path tempFile = null;

        try {

            // create a temp file to hold the picture
            tempFile = Files.createTempFile(null, null);

            // copy the picture to the temp file
            file.transferTo(tempFile.toFile());

            // get the contact
            Contact contact = contactRepository.findOne(id);

            // get the file extension
            String fileExtension = StringUtils.getFilenameExtension(file.getOriginalFilename());

            // set the picture as the contact content
            contactRepository.setContent(contact, fileExtension, tempFile.toString());

        } finally {
            // clean up the temp file
            FileSystemUtils.deleteRecursively(tempFile.toFile());
        }
    }

    /**
     * Method to map requests to GET a contact picture
     * @param id The ID of the contact
     * @param response servlet response used for returning the picture
     * @throws Exception
     */
    @RequestMapping(value = "/{id}/picture", method = RequestMethod.GET)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public void getContactPicture(@PathVariable String id, HttpServletResponse response) throws Exception {

        Path tempDir = null;

        try {

            // create a temp dir to hold the picture
            tempDir = Files.createTempDirectory(null);

            // get the contact
            Contact contact = contactRepository.findOne(id);

            // create a temp file name
            String tempFileName = tempDir.toString() + File.separator + UUID.randomUUID();

            // read the contact picture into the temp dir
            String picturePath = contactRepository.getContent(contact, tempFileName);

            // copy the file content to the response output stream
            FileInputStream fileInputStream = new FileInputStream(picturePath);
            IOUtils.copy(fileInputStream, response.getOutputStream());
            fileInputStream.close();

        } finally {
            // clean up the temp file and dir
            FileSystemUtils.deleteRecursively(tempDir.toFile());
        }
    }

    /*
     * setup the Documentum username/password/repository
     */
    private void setDCTMCredentials() {
        documentum.setCredentials(new UserCredentials(repositoryUsername, repositoryPassword));
        documentum.setDocBase(repositoryName);
    }
}
