package com.emc.documentum.sample.controller;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.authentication.UserCredentials;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.documentum.fc.common.DfException;
import com.emc.documentum.sample.domain.Contact;
import com.emc.documentum.springdata.core.Documentum;

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

    	return null;
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

    	return null;
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

    }

    /*
     * setup the Documentum username/password/repository
     */
    private void setDCTMCredentials() {
        documentum.setCredentials(new UserCredentials(repositoryUsername, repositoryPassword));
        documentum.setDocBase(repositoryName);
    }
}
