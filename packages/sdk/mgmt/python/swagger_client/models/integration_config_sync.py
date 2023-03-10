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

class IntegrationConfigSync(object):
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
        'period_ms': 'int'
    }

    attribute_map = {
        'period_ms': 'period_ms'
    }

    def __init__(self, period_ms=None):  # noqa: E501
        """IntegrationConfigSync - a model defined in Swagger"""  # noqa: E501
        self._period_ms = None
        self.discriminator = None
        self.period_ms = period_ms

    @property
    def period_ms(self):
        """Gets the period_ms of this IntegrationConfigSync.  # noqa: E501


        :return: The period_ms of this IntegrationConfigSync.  # noqa: E501
        :rtype: int
        """
        return self._period_ms

    @period_ms.setter
    def period_ms(self, period_ms):
        """Sets the period_ms of this IntegrationConfigSync.


        :param period_ms: The period_ms of this IntegrationConfigSync.  # noqa: E501
        :type: int
        """
        if period_ms is None:
            raise ValueError("Invalid value for `period_ms`, must not be `None`")  # noqa: E501

        self._period_ms = period_ms

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
        if issubclass(IntegrationConfigSync, dict):
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
        if not isinstance(other, IntegrationConfigSync):
            return False

        return self.__dict__ == other.__dict__

    def __ne__(self, other):
        """Returns true if both objects are not equal"""
        return not self == other
