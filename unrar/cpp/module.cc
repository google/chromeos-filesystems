// Copyright 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include "request.h"

#include <sstream>

#include "ppapi/cpp/instance.h"
#include "ppapi/cpp/logging.h"
#include "ppapi/cpp/module.h"
#include "ppapi/cpp/var_dictionary.h"

// An instance for every "embed" in the web page. For this extension only one
// "embed" is necessary.
class NaclArchiveInstance : public pp::Instance {
 public:
  explicit NaclArchiveInstance(PP_Instance instance) : pp::Instance(instance) {}
  virtual ~NaclArchiveInstance() {}

  // Handler for messages coming in from JS via postMessage().
  virtual void HandleMessage(const pp::Var& var_message) {
    PP_DCHECK(var_message.is_dictionary());
    pp::VarDictionary var_dict(var_message);

    PP_DCHECK(var_dict.Get(request::key::kOperation).is_int());
    int operation = var_dict.Get(request::key::kOperation).AsInt();

    PP_DCHECK(var_dict.Get(request::key::kFileSystemId).is_string());
    std::string file_system_id =
        var_dict.Get(request::key::kFileSystemId).AsString();

    PP_DCHECK(var_dict.Get(request::key::kRequestId).is_string());
    std::string request_id = var_dict.Get(request::key::kRequestId).AsString();

    // Process operation.
    switch (operation) {
      case request::READ_METADATA: {
        ReadMetadata(file_system_id, request_id);
        break;
      }

      default:
        PostMessage(request::CreateFileSystemError(
            "Invalid operation key", file_system_id, request_id));
    }
  }

 private:
  // TODO(cmihail): Modify fake data with actual data.
  void ReadMetadata(const std::string& file_system_id,
                    const std::string& request_id) {
    pp::VarDictionary metadata;
    // Create fake directories.
    bool is_directory = true;
    metadata.Set("/", CreateEntry("/", "/", is_directory, 0, 10000));
    metadata.Set("/dir1", CreateEntry("/dir1", "dir1", is_directory, 0, 20000));
    metadata.Set("/dir2", CreateEntry("/dir2", "dir2", is_directory, 0, 30000));
    metadata.Set("/dir1/dir3",
                 CreateEntry("/dir1/dir3", "dir3", is_directory, 0, 30050));

    // Create fake files.
    is_directory = false;
    metadata.Set("/f0", CreateEntry("/f0", "f0", is_directory, 500, 15000));
    metadata.Set("/dir1/f1",
                 CreateEntry("/dir1/f1", "f1", is_directory, 320, 40000));
    metadata.Set("/dir1/f2",
                 CreateEntry("/dir1/f2", "f2", is_directory, 150, 30000));
    metadata.Set("/dir2/f4",
                 CreateEntry("/dir2/f4", "f4", is_directory, 40, 30000));
    metadata.Set("/dir1/dir3/f3",
                 CreateEntry("/dir1/dir3/f3", "f3", is_directory, 200, 152000));

    PostMessage(request::CreateReadMetadataDoneResponse(
        file_system_id, request_id, metadata));
  }

  // size is int64_t and mtime is time_t because this is how libarchive is going
  // to pass them to us.
  pp::VarDictionary CreateEntry(const std::string& full_path,
                                const std::string& name,
                                bool is_directory,
                                int64_t size,
                                time_t mtime) const {
    pp::VarDictionary entry_metadata;
    entry_metadata.Set("isDirectory", is_directory);
    entry_metadata.Set("name", name);
    // size is int64_t, unsupported by pp::Var
    std::stringstream ss_size;
    ss_size << size;
    entry_metadata.Set("size", ss_size.str());
    // mtime is time_t, unsupported by pp::Var
    std::stringstream ss_mtime;
    ss_mtime << mtime;
    entry_metadata.Set("modificationTime", ss_mtime.str());

    return entry_metadata;
  }
};

// The Module class. The browser calls the CreateInstance() method to create
// an instance of your NaCl module on the web page. The browser creates a new
// instance for each <embed> tag with type="application/x-pnacl" or
// type="application/x-nacl".
class NaclArchiveModule : public pp::Module {
 public:
  NaclArchiveModule() : pp::Module() {}
  virtual ~NaclArchiveModule() {}

  // Create and return a NaclArchiveInstance object.
  // @param[in] instance The browser-side instance.
  // @return the plugin-side instance.
  virtual pp::Instance* CreateInstance(PP_Instance instance) {
    return new NaclArchiveInstance(instance);
  }
};

namespace pp {

// Factory function called by the browser when the module is first loaded.
// The browser keeps a singleton of this module.  It calls the
// CreateInstance() method on the object you return to make instances.  There
// is one instance per <embed> tag on the page.  This is the main binding
// point for your NaCl module with the browser.
Module* CreateModule() {
  return new NaclArchiveModule();
}

}  // namespace pp
