// this var contain all file objects inserted in input file
var filesContainer = [];

/** Drop file events do manage drag actions */
$(".dropFile__input")
  .on("dragleave drop", function (e) {
    thisDrop(e.target, ".dropFile__foil").removeClass("dragOn");
    thisDrop(e.target).removeClass("dragDetected");
  })
  .on("dragenter", function (e) {
    thisDrop(e.target, ".dropFile__foil").addClass("dragOn");
  })
  .on("change", function (e) {
    addFiles(e.target, e.target.files);
  });
$(".dropFile__filesArea")
  .on("click", function (e) {
    thisDrop(e.target, ".dropFile__input").click();
  })
  .on("dragenter", function (e) {
    thisDrop(e.target).addClass("dragDetected");
  });

/** dropFile generic events area (to remove, see content, modify...) */
$(".dropFile")
  .on("click", ".file__remove", function (e) {
    const fileName = $(e.target).parents(".file").attr("file-name");
    // input need to be enable before removeFile to work
    thisDrop(e.target, ".dropFile__input").prop("disabled", false);
    removeFiles(e.target, fileName);
  })
  .on("mouseenter", ".file__remove", function (e) {
    thisDrop(e.target, ".dropFile__input").prop("disabled", true);
  })
  .on("mouseleave", ".file__remove", function (e) {
    thisDrop(e.target, ".dropFile__input").prop("disabled", false);
  });

/** Just add file to array filesContainer and call draw for inserted file
 * @param {Object} domElement e.target
 * @param {array[Object]} files files to add
 */
function addFiles(domElement, files) {
  if (files && files.length > 0) {
    const newFiles = [];
    const isMultiple = thisDrop(domElement, ".dropFile__input").prop(
      "multiple"
    );
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const alreadyAdded = filesContainer.find((f) => f.name == file.name);
      if (!alreadyAdded) {
        newFiles.push(file);
      }
    }

    thisDrop(domElement, ".dropFile__filesContainer").removeClass("hidden");

    if (isMultiple) {
      filesContainer = filesContainer.concat(newFiles);
    } else {
      filesContainer = [newFiles[0]];
    }

    drawHtmlFilesAdded(domElement, newFiles, isMultiple);
  }
}

/** Remove file by file name
 * @param {Object} domElement e.target
 * @param {string} fileName name of file to remove
 */
function removeFiles(domElement, fileName) {
  filesContainer = filesContainer.filter((f) => f.name == fileName);
  thisDrop(domElement, `.file[file-name="${fileName}"]`).remove();

  if (filesContainer && filesContainer.length == 0) {
    thisDrop(domElement, ".dropFile__infoMessage").removeClass("hidden");
    thisDrop(domElement, ".dropFile__filesContainer").addClass("hidden");
  }
}

/** Draw files added hmtl
 * @param {Object} domElement e.target
 * @param {array[Object]} files files array object to draw
 * @param {boolean} isMultiple to limit draw
 */
function drawHtmlFilesAdded(domElement, files, isMultiple) {
  $(domElement)
    .parents(".dropFile")
    .find(".dropFile__infoMessage")
    .addClass("hidden");

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileSize = formatBytes(file.size);

    const htmlString = `
      <div class="file" file-name="${file.name}">
          <div class="file__size">${fileSize}</div>
          <div class="file__name">${file.name}</div>
          <div class="file__remove">Remove</div>
      </div>
    `;

    if (isMultiple) {
      $(".dropFile__filesContainer").append(htmlString);
    } else {
      $(".dropFile__filesContainer").html(htmlString);
    }
  }
}

/** Get any element inside drop file based in e.target and findSelector
 * @param {Object} eTarget e.target
 * @param {string} findSelector selector with jquery sintax
 * @returns {Object} Jquery object
 */
function thisDrop(eTarget, findSelector) {
  if (findSelector) {
    return $(eTarget).parents(".dropFile").find(findSelector);
  } else {
    return $(eTarget).parents(".dropFile");
  }
}

/** Get bytes and convert them to computer units of measure
 * @param {number | string} bytes
 * @param {number} decimals
 * @returns {string} xx.xx Bytes || KB || MB ...
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
