# coding: utf-8

"""
    Supaglue Management API

    # Introduction  Welcome to the Supaglue Management API documentation. You can use this API to manage customer integrations and connections.  ### Base API URL  ``` http://localhost:8080/mgmt/v1 ```   # noqa: E501

    OpenAPI spec version: 0.3.3
    Contact: docs@supaglue.com
    Generated by: https://github.com/swagger-api/swagger-codegen.git
"""

import pprint
import re  # noqa: F401

import six

class IntegrationConfigOauthCredentials(object):
    """NOTE: This class is auto generated by the swagger code generator program.

    Do not edit the class manually.
    """
    """
    Attributes:
      swagger_types (dict): The key is attribute name
                            and the value is attribute type.
      attribute_map (dict): The key is attribute name
                            and the value is json key in definition.
    """
    swagger_types = {
        'oauth_client_id': 'str',
        'oauth_client_secret': 'str'
    }

    attribute_map = {
        'oauth_client_id': 'oauth_client_id',
        'oauth_client_secret': 'oauth_client_secret'
    }

    def __init__(self, oauth_client_id=None, oauth_client_secret=None):  # noqa: E501
        """IntegrationConfigOauthCredentials - a model defined in Swagger"""  # noqa: E501
        self._oauth_client_id = None
        self._oauth_client_secret = None
        self.discriminator = None
        self.oauth_client_id = oauth_client_id
        self.oauth_client_secret = oauth_client_secret

    @property
    def oauth_client_id(self):
        """Gets the oauth_client_id of this IntegrationConfigOauthCredentials.  # noqa: E501


        :return: The oauth_client_id of this IntegrationConfigOauthCredentials.  # noqa: E501
        :rtype: str
        """
        return self._oauth_client_id

    @oauth_client_id.setter
    def oauth_client_id(self, oauth_client_id):
        """Sets the oauth_client_id of this IntegrationConfigOauthCredentials.


        :param oauth_client_id: The oauth_client_id of this IntegrationConfigOauthCredentials.  # noqa: E501
        :type: str
        """
        if oauth_client_id is None:
            raise ValueError("Invalid value for `oauth_client_id`, must not be `None`")  # noqa: E501

        self._oauth_client_id = oauth_client_id

    @property
    def oauth_client_secret(self):
        """Gets the oauth_client_secret of this IntegrationConfigOauthCredentials.  # noqa: E501


        :return: The oauth_client_secret of this IntegrationConfigOauthCredentials.  # noqa: E501
        :rtype: str
        """
        return self._oauth_client_secret

    @oauth_client_secret.setter
    def oauth_client_secret(self, oauth_client_secret):
        """Sets the oauth_client_secret of this IntegrationConfigOauthCredentials.


        :param oauth_client_secret: The oauth_client_secret of this IntegrationConfigOauthCredentials.  # noqa: E501
        :type: str
        """
        if oauth_client_secret is None:
            raise ValueError("Invalid value for `oauth_client_secret`, must not be `None`")  # noqa: E501

        self._oauth_client_secret = oauth_client_secret

    def to_dict(self):
        """Returns the model properties as a dict"""
        result = {}

        for attr, _ in six.iteritems(self.swagger_types):
            value = getattr(self, attr)
            if isinstance(value, list):
                result[attr] = list(map(
                    lambda x: x.to_dict() if hasattr(x, "to_dict") else x,
                    value
                ))
            elif hasattr(value, "to_dict"):
                result[attr] = value.to_dict()
            elif isinstance(value, dict):
                result[attr] = dict(map(
                    lambda item: (item[0], item[1].to_dict())
                    if hasattr(item[1], "to_dict") else item,
                    value.items()
                ))
            else:
                result[attr] = value
        if issubclass(IntegrationConfigOauthCredentials, dict):
            for key, value in self.items():
                result[key] = value

        return result

    def to_str(self):
        """Returns the string representation of the model"""
        return pprint.pformat(self.to_dict())

    def __repr__(self):
        """For `print` and `pprint`"""
        return self.to_str()

    def __eq__(self, other):
        """Returns true if both objects are equal"""
        if not isinstance(other, IntegrationConfigOauthCredentials):
            return False

        return self.__dict__ == other.__dict__

    def __ne__(self, other):
        """Returns true if both objects are not equal"""
        return not self == other
