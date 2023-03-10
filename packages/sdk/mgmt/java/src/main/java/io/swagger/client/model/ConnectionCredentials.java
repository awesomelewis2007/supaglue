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
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.IOException;
/**
 * ConnectionCredentials
 */


public class ConnectionCredentials {
  @SerializedName("type")
  private String type = null;

  @SerializedName("access_token")
  private String accessToken = null;

  @SerializedName("refresh_token")
  private String refreshToken = null;

  @SerializedName("instance_url")
  private String instanceUrl = null;

  @SerializedName("expires_at")
  private String expiresAt = null;

  public ConnectionCredentials type(String type) {
    this.type = type;
    return this;
  }

   /**
   * Get type
   * @return type
  **/
  @Schema(example = "oauth2", description = "")
  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public ConnectionCredentials accessToken(String accessToken) {
    this.accessToken = accessToken;
    return this;
  }

   /**
   * Get accessToken
   * @return accessToken
  **/
  @Schema(example = "00DDn000004L1rN!AQwAQFcdcvZCaMN83FUDEI5BHyjWILUCMH91UOX7xPVAgn2DjT9LrYTX8RT9vSQ281kBUtQBNsjBKC6R4lIlQTLLvCTuYxtJ", description = "")
  public String getAccessToken() {
    return accessToken;
  }

  public void setAccessToken(String accessToken) {
    this.accessToken = accessToken;
  }

  public ConnectionCredentials refreshToken(String refreshToken) {
    this.refreshToken = refreshToken;
    return this;
  }

   /**
   * Get refreshToken
   * @return refreshToken
  **/
  @Schema(example = "5Aep861J.7rrvmXwLwV8Hw86X7cQtxqOq1cNOt9LLourdPAeVgOQHl7idtvQp_e70Q_r20DpwpB4Mo.45QlO29e", description = "")
  public String getRefreshToken() {
    return refreshToken;
  }

  public void setRefreshToken(String refreshToken) {
    this.refreshToken = refreshToken;
  }

  public ConnectionCredentials instanceUrl(String instanceUrl) {
    this.instanceUrl = instanceUrl;
    return this;
  }

   /**
   * Get instanceUrl
   * @return instanceUrl
  **/
  @Schema(example = "https://myapp-dev-ed.develop.my.salesforce.com", description = "")
  public String getInstanceUrl() {
    return instanceUrl;
  }

  public void setInstanceUrl(String instanceUrl) {
    this.instanceUrl = instanceUrl;
  }

  public ConnectionCredentials expiresAt(String expiresAt) {
    this.expiresAt = expiresAt;
    return this;
  }

   /**
   * Get expiresAt
   * @return expiresAt
  **/
  @Schema(example = "2023-03-09T21:55:54.000Z", description = "")
  public String getExpiresAt() {
    return expiresAt;
  }

  public void setExpiresAt(String expiresAt) {
    this.expiresAt = expiresAt;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ConnectionCredentials connectionCredentials = (ConnectionCredentials) o;
    return Objects.equals(this.type, connectionCredentials.type) &&
        Objects.equals(this.accessToken, connectionCredentials.accessToken) &&
        Objects.equals(this.refreshToken, connectionCredentials.refreshToken) &&
        Objects.equals(this.instanceUrl, connectionCredentials.instanceUrl) &&
        Objects.equals(this.expiresAt, connectionCredentials.expiresAt);
  }

  @Override
  public int hashCode() {
    return Objects.hash(type, accessToken, refreshToken, instanceUrl, expiresAt);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ConnectionCredentials {\n");
    
    sb.append("    type: ").append(toIndentedString(type)).append("\n");
    sb.append("    accessToken: ").append(toIndentedString(accessToken)).append("\n");
    sb.append("    refreshToken: ").append(toIndentedString(refreshToken)).append("\n");
    sb.append("    instanceUrl: ").append(toIndentedString(instanceUrl)).append("\n");
    sb.append("    expiresAt: ").append(toIndentedString(expiresAt)).append("\n");
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
