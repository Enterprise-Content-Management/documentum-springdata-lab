package com.emc.documentum.sample.repositories;

import com.emc.documentum.sample.domain.Contact;
import com.emc.documentum.springdata.repository.DctmRepositoryWithContent;

/**
 * Basic Contact Spring Data Repository used for interacting with contact repository objects
 *
 * @author Simon O'Brien
 */
public interface ContactRepository extends DctmRepositoryWithContent<Contact, String> {

}
