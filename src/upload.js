document.getElementById('drop-area').addEventListener('dragover', (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.target.style.borderColor = 'green';
});

document.getElementById('drop-area').addEventListener('dragleave', (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.target.style.borderColor = '#ccc';
});

document.getElementById('drop-area').addEventListener('drop', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    for (let file of files) {
        await uploadFileToAzure(file);
    }
});

async function uploadFileToAzure(file) {

    const sasToken = 'exSbdrCgGDIT+KAp50HUC4lJxo/cP3nNqmXXDBN3MLUYP7O4O6cFDFFcKgxPkESEPa1zcx9QKMXA+AStctk5bg==';
    const containerName = 'b274bc31-6761-4c26-90a4-cdf21179bc6a-azureml-blobstore/UI/2024-08-05_181707_UTC';
    const blobServiceClient = new Azure.Storage.Blob.BlobServiceClient(`https://sthubdcdaiev872603525595.blob.core.windows.net?AccountKey=${sasToken}`);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(file.name);

    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.getElementById('progress-container');
    const message = document.getElementById('message');

    progressContainer.style.display = 'block';
    progressBar.style.width = '0%';
    message.textContent = '';

    try {
        await blockBlobClient.uploadBrowserData(file, {
            onProgress: (ev) => {
                const percentComplete = (ev.loadedBytes / file.size) * 100;
                progressBar.style.width = `${percentComplete}%`;
            }
        });
        message.textContent = `${file.name} uploaded successfully!`;
        message.style.color = 'green';
    } catch (error) {
        message.textContent = `Failed to upload ${file.name}.`;
        message.style.color = 'red';
    }
}
