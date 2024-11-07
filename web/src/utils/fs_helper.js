/**
 * Helper functions for reading and writing file system
 * 
 * For more information, please visit:
 * https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
 */
export async function fsWriteFile(fh, content) {
    const writable = await fh.createWritable();
    
    // write the contents
    await writable.write(content);

    // close the file
    await writable.close();

    return fh;
}

export async function fsOpenFile(options) {
    let fsfhs = await window.showOpenFilePicker(options);
    let fsfh = fsfhs[0];
    const file = await fsfh.getFile();
    return {
        fh: fsfh,
        file: file
    };
}