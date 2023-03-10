/*
 * Supaglue Management API
 * # Introduction  Welcome to the Supaglue Management API documentation. You can use this API to manage customer integrations and connections.  ### Base API URL  ``` http://localhost:8080/mgmt/v1 ``` 
 *
 * OpenAPI spec version: 0.3.3
 * Contact: docs@supaglue.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

package io.swagger.client.model;

import java.util.Objects;
import java.util.Arrays;
import com.google.gson.TypeAdapter;
import com.google.gson.annotations.JsonAdapter;
import com.google.gson.annotations.SerializedName;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;
import io.swagger.client.model.IntegrationConfigOauthCredentials;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
/**
 * IntegrationConfigOauth
 */


public class IntegrationConfigOauth {
  @SerializedName("oauth_scopes")
  private List<String> oauthScopes = new ArrayList<String>();

  @SerializedName("credentials")
  private IntegrationConfigOauthCredentials credentials = null;

  public IntegrationConfigOauth oauthScopes(List<String> oauthScopes) {
    this.oauthScopes = oauthScopes;
    return this;
  }

  public IntegrationConfigOauth addOauthScopesItem(String oauthScopesItem) {
    this.oauthScopes.add(oauthScopesItem);
    return this;
  }

   /**
   * Get oauthScopes
   * @return oauthScopes
  **/
  @Schema(required = true, description = "")
  public List<String> getOauthScopes() {
    return oauthScopes;
  }

  public void setOauthScopes(List<String> oauthScopes) {
    this.oauthScopes = oauthScopes;
  }

  public IntegrationConfigOauth credentials(IntegrationConfigOauthCredentials credentials) {
    this.credentials = credentials;
    return this;
  }

   /**
   * Get credentials
   * @return credentials
  **/
  @Schema(required = true, description = "")
  public IntegrationConfigOauthCredentials getCredentials() {
    return credentials;
  }

  public void setCredentials(IntegrationConfigOauthCredentials credentials) {
    this.credentials = credentials;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    IntegrationConfigOauth integrationConfigOauth = (IntegrationConfigOauth) o;
    return Objects.equals(this.oauthScopes, integrationConfigOauth.oauthScopes) &&
        Objects.equals(this.credentials, integrationConfigOauth.credentials);
  }

  @Override
  public int hashCode() {
    return Objects.hash(oauthScopes, credentials);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class IntegrationConfigOauth {\n");
    
    sb.append("    oauthScopes: ").append(toIndentedString(oauthScopes)).append("\n");
    sb.append("    credentials: ").append(toIndentedString(credentials)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(java.lang.Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }

}
