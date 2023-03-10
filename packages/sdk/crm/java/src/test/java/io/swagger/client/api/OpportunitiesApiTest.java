/*
 * Supaglue CRM API
 * # Introduction  Welcome to the Supaglue unified CRM API documentation. You can use this API to read data that has been synced into Supaglue from third-party providers.  ### Base API URL  ``` http://localhost:8080/api/crm/v1 ``` 
 *
 * OpenAPI spec version: 0.3.3
 * Contact: docs@supaglue.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

package io.swagger.client.api;

import io.swagger.client.model.InlineResponse2003;
import io.swagger.client.model.InlineResponse2013;
import org.threeten.bp.OffsetDateTime;
import io.swagger.client.model.OpportunitiesBody;
import io.swagger.client.model.OpportunitiesOpportunityIdBody;
import io.swagger.client.model.Opportunity;
import org.junit.Test;
import org.junit.Ignore;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * API tests for OpportunitiesApi
 */
@Ignore
public class OpportunitiesApiTest {

    private final OpportunitiesApi api = new OpportunitiesApi();

    /**
     * Create opportunity
     *
     * 
     *
     * @throws Exception
     *          if the Api call fails
     */
    @Test
    public void createOpportunityTest() throws Exception {
        OpportunitiesBody body = null;
        String customerId = null;
        String providerName = null;
        InlineResponse2013 response = api.createOpportunity(body, customerId, providerName);

        // TODO: test validations
    }
    /**
     * List opportunities
     *
     * Get a list of opportunities
     *
     * @throws Exception
     *          if the Api call fails
     */
    @Test
    public void getOpportunitiesTest() throws Exception {
        String customerId = null;
        String providerName = null;
        OffsetDateTime createdAfter = null;
        OffsetDateTime createdBefore = null;
        OffsetDateTime updatedAfter = null;
        OffsetDateTime updatedBefore = null;
        String cursor = null;
        String expand = null;
        String pageSize = null;
        InlineResponse2003 response = api.getOpportunities(customerId, providerName, createdAfter, createdBefore, updatedAfter, updatedBefore, cursor, expand, pageSize);

        // TODO: test validations
    }
    /**
     * Get opportunity
     *
     * 
     *
     * @throws Exception
     *          if the Api call fails
     */
    @Test
    public void getOpportunityTest() throws Exception {
        String customerId = null;
        String providerName = null;
        String opportunityId = null;
        String expand = null;
        Opportunity response = api.getOpportunity(customerId, providerName, opportunityId, expand);

        // TODO: test validations
    }
    /**
     * Update opportunity
     *
     * 
     *
     * @throws Exception
     *          if the Api call fails
     */
    @Test
    public void updateOpportunityTest() throws Exception {
        OpportunitiesOpportunityIdBody body = null;
        String customerId = null;
        String providerName = null;
        String opportunityId = null;
        InlineResponse2013 response = api.updateOpportunity(body, customerId, providerName, opportunityId);

        // TODO: test validations
    }
}