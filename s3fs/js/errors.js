// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

/**
 * WebDAV error code map.
 * All taken from http://docs.aws.amazon.com/AmazonS3/latest/API/ErrorResponses.html
 * @const
 * @type {Object}
 */
var ERROR_MAP = {
  AccessDenied: 'ACCESS_DENIED',
  AccountProblem: 'FAILED',
  AmbiguousGrantByEmailAddress: 'INVALID_OPERATION',
  BadDigest: 'INVALID_OPERATION',
  BucketAlreadyExists: 'EXISTS',
  BucketAlreadyOwnedByYou: 'FAILED',
  BucketNotEmpty: 'NOT_EMPTY',
  CredentialsNotSupported: 'INVALID_OPERATION',
  CrossLocationLoggingProhibited: 'ACCESS_DENIED',
  EntityTooSmall: 'INVALID_OPERATION',
  EntityTooLarge: 'INVALID_OPERATION',
  ExpiredToken: 'ACCESS_DENIED',
  IllegalVersioningConfigurationException: 'ACCESS_DENIED',
  IncompleteBody: 'INVALID_OPERATION',
  IncorrectNumberOfFilesInPostRequest: 'INVALID_OPERATION',
  InlineDataTooLarge: 'INVALID_OPERATION',
  InternalError: 'FAILED',
  InvalidAccessKeyId: 'INVALID_OPERATION',
  InvalidAddressingHeader: 'INVALID_OPERATION',
  InvalidArgument: 'INVALID_OPERATION',
  InvalidBucketName: 'INVALID_OPERATION',
  InvalidBucketState: 'INVALID_OPERATION',
  InvalidDigest: 'INVALID_OPERATION',
  InvalidEncryptionAlgorithmError: 'INVALID_OPERATION',
  InvalidLocationConstraint: 'INVALID_OPERATION',
  InvalidObjectState: 'INVALID_OPERATION',
  InvalidPart: 'INVALID_OPERATION',
  InvalidPartOrder: 'INVALID_OPERATION',
  InvalidPayer: 'INVALID_OPERATION',
  InvalidPolicyDocument: 'INVALID_OPERATION',
  InvalidRange: 'INVALID_OPERATION',
  InvalidRequest: 'INVALID_OPERATION',
  InvalidSecurity: 'INVALID_OPERATION',
  InvalidSOAPRequest: 'INVALID_OPERATION',
  InvalidStorageClass: 'INVALID_OPERATION',
  InvalidTargetBucketForLogging: 'INVALID_OPERATION',
  InvalidToken: 'INVALID_OPERATION',
  InvalidURI: 'INVALID_OPERATION',
  KeyTooLong: 'INVALID_OPERATION',
  MalformedACLError: 'INVALID_OPERATION',
  MalformedPOSTRequest: 'INVALID_OPERATION',
  MalformedXML: 'INVALID_OPERATION',
  MaxMessageLengthExceeded: 'INVALID_OPERATION',
  MaxPostPreDataLengthExceededError: 'INVALID_OPERATION',
  MetadataTooLarge: 'INVALID_OPERATION',
  MethodNotAllowed: 'ACCESS_DENIED',
  MissingAttachment: 'INVALID_OPERATION',
  MissingContentLength: 'INVALID_OPERATION',
  MissingRequestBodyError: 'INVALID_OPERATION',
  MissingSecurityElement: 'INVALID_OPERATION',
  MissingSecurityHeader: 'INVALID_OPERATION',
  NoLoggingStatusForKey: 'INVALID_OPERATION',
  NoSuchBucket: 'NOT_FOUND',
  NoSuchKey: 'NOT_FOUND',
  NoSuchLifecycleConfiguration: 'NOT_FOUND',
  NoSuchUpload: 'NOT_FOUND',
  NoSuchVersion: 'NOT_FOUND',
  NotImplemented: 'INVALID_OPERATION',
  NotSignedUp: 'ACCESS_DENIED',
  NotSuchBucketPolicy: 'NOT_FOUND',
  OperationAborted: 'FAILED',
  PermanentRedirect: 'FAILED',
  PreconditionFailed: 'FAILED',
  Redirect: 'FAILED',
  RestoreAlreadyInProgress: 'INVALID_OPERATION',
  RequestIsNotMultiPartContent: 'INVALID_OPERATION',
  RequestTimeout: 'FAILED',
  RequestTimeTooSkewed: 'FAILED',
  RequestTorrentOfBucketError: 'FAILED',
  SignatureDoesNotMatch: 'ACCESS_DENIED',
  ServiceUnavailable: 'NOT_FOUND',
  SlowDown: 'INVALID_OPERATION',
  TemporaryRedirect: 'INVALID_OPERATION',
  TokenRefreshRequired: 'ACCESS_DENIED',
  TooManyBuckets: 'INVALID_OPERATION',
  UnexpectedContent: 'INVALID_OPERATION',
  UnresolvableGrantByEmailAddress: 'SECURITY',
  UserKeyMustBeSpecified: 'INVALID_OPERATION'
};

/**
 * Converts an AWS SDK error code into its equivalent code for the FSP API.
 * @param {Error} code The AWS SDK error object.
 * @return {string} The FSP error code.
 */
var getError = function(error) {
  return ERROR_MAP[error.code] || 'FAILED';
};

module.exports = getError;
