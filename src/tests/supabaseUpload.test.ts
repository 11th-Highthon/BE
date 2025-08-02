
import * as dotenv from 'dotenv';
dotenv.config();

import supabase from '../utils/supabase';
import * as fs from 'fs';
import * as path from 'path';

async function uploadTestFile() {
  const bucketName = 'audio-files';
  const filePathInBucket = `test-audio-${Date.now()}.txt`; // Unique file name
  const localFilePath = path.join(__dirname, 'test-audio.txt');

  // Create a dummy file for testing
  fs.writeFileSync(localFilePath, 'This is a test audio file content.');

  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePathInBucket, fs.readFileSync(localFilePath), {
        contentType: 'text/plain',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading file:', error.message);
      return;
    }

    console.log('File uploaded successfully:', data);

    // Optionally, clean up the local dummy file
    fs.unlinkSync(localFilePath);

  } catch (err) {
    console.error('An unexpected error occurred:', err);
  }
}

uploadTestFile();
