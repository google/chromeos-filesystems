// Copyright 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include "request.h"

// Creates a basic request with the mandatory fields.
static pp::VarDictionary CreateBasicRequest(const int operation,
                                            const std::string& file_system_id,
                                            const std::string& request_id) {
  pp::VarDictionary request;
  request.Set(request::key::kOperation, operation);
  request.Set(request::key::kFileSystemId, file_system_id);
  request.Set(request::key::kRequestId, request_id);
  return request;
}

pp::VarDictionary request::CreateReadMetadataDoneResponse(
    const std::string& file_system_id,
    const std::string& request_id,
    const pp::VarDictionary& metadata) {
  pp::VarDictionary request =
      CreateBasicRequest(READ_METADATA_DONE, file_system_id, request_id);
  request.Set(request::key::kMetadata, metadata);
  return request;
}

pp::VarDictionary request::CreateFileSystemError(
    const std::string& error,
    const std::string& file_system_id,
    const std::string& request_id) {
  pp::VarDictionary request =
      CreateBasicRequest(FILE_SYSTEM_ERROR, file_system_id, request_id);
  request.Set(request::key::kError, error);
  return request;
}
