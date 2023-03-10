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
import io.swagger.client.model.Category;
import io.swagger.client.model.ConnectionCredentials;
import io.swagger.client.model.ProviderName;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.IOException;
/**
 * Connection
 */


public class Connection {
  @SerializedName("id")
  private String id = null;

  /**
   * Gets or Sets status
   */
  @JsonAdapter(StatusEnum.Adapter.class)
  public enum StatusEnum {
    AVAILABLE("available"),
    ADDED("added"),
    AUTHORIZED("authorized"),
    CALLABLE("callable");

    private String value;

    StatusEnum(String value) {
      this.value = value;
    }
    public String getValue() {
      return value;
    }

    @Override
    public String toString() {
      return String.valueOf(value);
    }
    public static StatusEnum fromValue(String input) {
      for (StatusEnum b : StatusEnum.values()) {
        if (b.value.equals(input)) {
          return b;
        }
      }
      return null;
    }
    public static class Adapter extends TypeAdapter<StatusEnum> {
      @Override
      public void write(final JsonWriter jsonWriter, final StatusEnum enumeration) throws IOException {
        jsonWriter.value(String.valueOf(enumeration.getValue()));
      }

      @Override
      public StatusEnum read(final JsonReader jsonReader) throws IOException {
        Object value = jsonReader.nextString();
        return StatusEnum.fromValue((String)(value));
      }
    }
  }  @SerializedName("status")
  private StatusEnum status = null;

  @SerializedName("customer_id")
  private String customerId = null;

  @SerializedName("integration_id")
  private String integrationId = null;

  @SerializedName("credentials")
  private ConnectionCredentials credentials = null;

  @SerializedName("provider_name")
  private ProviderName providerName = null;

  @SerializedName("category")
  private Category category = null;

  public Connection id(String id) {
    this.id = id;
    return this;
  }

   /**
   * Get id
   * @return id
  **/
  @Schema(example = "e888cedf-e9d0-42c5-9485-2d72984faef2", required = true, description = "")
  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public Connection status(StatusEnum status) {
    this.status = status;
    return this;
  }

   /**
   * Get status
   * @return status
  **/
  @Schema(example = "available", required = true, description = "")
  public StatusEnum getStatus() {
    return status;
  }

  public void setStatus(StatusEnum status) {
    this.status = status;
  }

  public Connection customerId(String customerId) {
    this.customerId = customerId;
    return this;
  }

   /**
   * Get customerId
   * @return customerId
  **/
  @Schema(example = "d8ceb3ff-8b7f-4fa7-b8de-849292f6ca69", required = true, description = "")
  public String getCustomerId() {
    return customerId;
  }

  public void setCustomerId(String customerId) {
    this.customerId = customerId;
  }

  public Connection integrationId(String integrationId) {
    this.integrationId = integrationId;
    return this;
  }

   /**
   * Get integrationId
   * @return integrationId
  **/
  @Schema(example = "9572d08b-f19f-48cc-a992-1eb7031d3f6a", required = true, description = "")
  public String getIntegrationId() {
    return integrationId;
  }

  public void setIntegrationId(String integrationId) {
    this.integrationId = integrationId;
  }

  public Connection credentials(ConnectionCredentials credentials) {
    this.credentials = credentials;
    return this;
  }

   /**
   * Get credentials
   * @return credentials
  **/
  @Schema(required = true, description = "")
  public ConnectionCredentials getCredentials() {
    return credentials;
  }

  public void setCredentials(ConnectionCredentials credentials) {
    this.credentials = credentials;
  }

  public Connection providerName(ProviderName providerName) {
    this.providerName = providerName;
    return this;
  }

   /**
   * Get providerName
   * @return providerName
  **/
  @Schema(required = true, description = "")
  public ProviderName getProviderName() {
    return providerName;
  }

  public void setProviderName(ProviderName providerName) {
    this.providerName = providerName;
  }

  public Connection category(Category category) {
    this.category = category;
    return this;
  }

   /**
   * Get category
   * @return category
  **/
  @Schema(required = true, description = "")
  public Category getCategory() {
    return category;
  }

  public void setCategory(Category category) {
    this.category = category;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Connection connection = (Connection) o;
    return Objects.equals(this.id, connection.id) &&
        Objects.equals(this.status, connection.status) &&
        Objects.equals(this.customerId, connection.customerId) &&
        Objects.equals(this.integrationId, connection.integrationId) &&
        Objects.equals(this.credentials, connection.credentials) &&
        Objects.equals(this.providerName, connection.providerName) &&
        Objects.equals(this.category, connection.category);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, status, customerId, integrationId, credentials, providerName, category);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Connection {\n");
    
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    status: ").append(toIndentedString(status)).append("\n");
    sb.append("    customerId: ").append(toIndentedString(customerId)).append("\n");
    sb.append("    integrationId: ").append(toIndentedString(integrationId)).append("\n");
    sb.append("    credentials: ").append(toIndentedString(credentials)).append("\n");
    sb.append("    providerName: ").append(toIndentedString(providerName)).append("\n");
    sb.append("    category: ").append(toIndentedString(category)).append("\n");
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
