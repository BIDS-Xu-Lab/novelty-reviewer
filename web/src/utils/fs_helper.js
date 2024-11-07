/**
 * Helper functions for reading and writing file system
 * 
 * For more information, please visit:
 * https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
 */

export async function fs_read_file_system_handle(fh) {
    // get the text content
    const text = await fh.text();

    // return the content and fh
    return {
        fh: fh,
        fn: fh.name,
        has_saved: true,
        timestamp: fh.lastModified,
        text: text
    };
}

export async function fs_write_file_system_handle(fh, content) {
    const writable = await fh.createWritable();
    
    // write the contents
    await writable.write(content);

    // close the file
    await writable.close();

    return fh;
}

/**
 * Save the given customized file
 * 
 * @param {Object} file the customized file object with text
 * @returns updated file object
 */
export async function fs_save_file(file) {

    // write to fh!
    await fs_write_file_system_handle(file.fh, file.text);

    // done!
    file.has_saved = true

    return file;
}
