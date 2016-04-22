package com.emc.documentum.sample.repositories;

import com.emc.documentum.sample.domain.Contact;
import com.emc.documentum.springdata.repository.DctmRepositoryWithContent;
import com.emc.documentum.springdata.repository.Query;

/**
 * Basic Contact Spring Data Repository used for interacting with contact repository objects
 *
 * @author Simon O'Brien
 */
public interface ContactRepository extends DctmRepositoryWithContent<Contact, String> {

	/**
     * Find all contacts
     *
     * NOTE: this is an override of the OOTB DctmRepository behaviour as repeating value attributes are not being returned
     *
     * TODO: remove override once repeating attribute bug is fixed
     *
     * @return query results
     */
    @Override
    @Query("select r_object_id, object_name, email, telephone, groups, r_content_size from contact")
    public Iterable<Contact> findAll();	
}
