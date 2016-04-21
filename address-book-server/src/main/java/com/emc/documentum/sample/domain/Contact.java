package com.emc.documentum.sample.domain;

import com.emc.documentum.springdata.entitymanager.mapping.DctmAttribute;
import com.emc.documentum.springdata.entitymanager.mapping.DctmEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;

import java.util.List;

/**
 * Contact domain object represents contact repository object
 *
 * @author Simon O'Brien
 */
@DctmEntity(repository = "contact")
public class Contact {

	@Id
	protected String id;

	@DctmAttribute(value="object_name")
	private String name;

	private String email;

	private String telephone;

	private List<String> groups;

	/*
	 * do not return content size in the json, this
	 * property is used to populate the hasPicture
	 * Boolean json response property
	 */
	@JsonIgnore
	@DctmAttribute(value="r_content_size")
	private Integer contentSize = 0;

	/**
	 * Get the ID
	 *
	 * @return the ID
	 */
    public String getId() {
        return id;
    }

	/**
	 * Set the ID
	 *
	 * @param id the ID
	 */
    public void setId(String id) {
        this.id = id;
    }

	/**
	 * Get the name
	 *
	 * @return the name
	 */
	public String getName() {
		return name;
	}

	/**
	 * Set the name
	 *
	 * @param name the name
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * Get the email address
	 *
	 * @return the email address
	 */
    public String getEmail() {
        return email;
    }

	/**
	 * Set the email address
	 *
	 * @param email the email address
	 */
    public void setEmail(String email) {
        this.email = email;
    }

	/**
	 * Get the telephone
	 *
	 * @return the telephone
	 */
	public String getTelephone() {
		return telephone;
	}

	/**
	 * Set the telephone
	 *
	 * @param telephone the telephone
	 */
	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}

	/**
	 * Get the groups
	 *
	 * @return the groups
	 */
	public List<String> getGroups() {
		return this.groups;
	}

	/**
	 * Set the groups
	 *
	 * @param groups the groups
	 */
	public void setGroups(List<String> groups) {
		this.groups = groups;
	}

	/**
	 * Get the content size
	 *
	 * @return the content size
	 */
	public Integer getContentSize() {
		return this.contentSize;
	}

	/**
	 * Set the content size
	 *
	 * @param contentSize the content size
	 */
	public void setContentSize(Integer contentSize) {
		this.contentSize = contentSize;
	}

	/**
	 * Gets if the contact has a picture (determined by the content size)
	 *
	 * @return if the contact has a picture
	 */
	@JsonProperty
	public Boolean hasPicture() {
		if(this.contentSize > 0) {
			return Boolean.TRUE;
		} else {
			return Boolean.FALSE;
		}
	}
}
