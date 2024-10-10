<script>
  import { onMount } from "svelte";
  import { axios } from '$lib/config';

  let errorMessage = '';
  let successMessage = '';
  let uploadProgress = 0; // Track upload progress
  let isUploading = false; // Track whether upload is in progress
  let records = [];
  let currentPage = 1;
  let totalPages = 1;
  const recordsPerPage = 10; // Set the number of records per page
  let file = null; // To store the selected file
  let searchTerm = ''; // To store the search input

  onMount(async () => {
    fetchRecords();
  });

  async function fetchRecords(page=1, search = '') {
    try {
      const response = await axios.post('/getRecords', {
          page: page,       
          limit: recordsPerPage,
          search: search
      }, {
          withCredentials: true
      });
      if (response.status === 200) {
        records = response.data.data;
        currentPage = response.data.currentPage;
        totalPages = response.data.totalPages;
      }
    } catch (error) {
      console.error("Error fetching data", error);
      errorMessage = 'Error fetching data';
    }
  }

  function nextPage() {
    if (currentPage < totalPages) {
      fetchRecords(currentPage + 1);
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      fetchRecords(currentPage - 1);
    }
  }

  // Search function to handle input changes
  function handleSearch() {
    fetchRecords(1, searchTerm); // Always search from the first page
  }

  // Handle file input change
  function handleFileChange(event) {
    file = event.target.files[0]; // Assign the selected file to the variable
    errorMessage = '';
    successMessage = '';
  }

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('csvFile', file);

      isUploading = true; // Set uploading status
      uploadProgress = 0; // Reset progress bar

      try {
        const response = await axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }, 
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.lengthComputable) {
              uploadProgress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            }
          }
        });
        if (response.status === 200) {
          successMessage = 'File uploaded successfully!';
          await fetchRecords();
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        errorMessage = 'Error uploading file';
      } finally {
        isUploading = false; // Reset uploading status when done
      }
    } else {
      errorMessage = 'Please select a file';
    }
  };
</script>

<div class="view">
  {#if errorMessage}
  <p style="color: red;">{errorMessage}</p>
  {/if}

  {#if successMessage}
  <p style="color: green;">{successMessage}</p>
  {/if}

  <form on:submit|preventDefault={handleUpload} class="upload-file">
    <h2>Upload file</h2>
    <input type="file" name="csvFile" accept=".csv" on:change={handleFileChange}/>
    <button type="submit" disabled={isUploading}>Upload CSV</button>
  </form>

  {#if isUploading}
    <div>
      <p>Uploading... {uploadProgress}%</p>
      <progress value={uploadProgress} max="100"></progress>
    </div>
  {/if}

  <div>
    <h2>View Data</h2>

    <!-- Search form -->
    <form on:submit|preventDefault={handleSearch} class="search-form">
      <input type="text" bind:value={searchTerm} placeholder="Search..." />
      <button type="submit">Search</button>
    </form>

    {#if records.length > 0}
      <table>
        <thead>
          <tr>
            <th>Post ID</th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Body</th>
          </tr>
        </thead>
        <tbody>
          {#each records as record}
            <tr>
              <td>{record.postid}</td>
              <td>{record.id}</td>
              <td>{record.name}</td>
              <td>{record.email}</td>
              <td>{record.body}</td>
            </tr>
          {/each}
        </tbody>
      </table>

      <div class="pagination">
        <button on:click={prevPage} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button on:click={nextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    {:else}
      <p>No data available.</p>
    {/if}
  </div>
</div>

<style>
  progress {
    width: 100%;
    height: 20px;
  }
  .search-form {
    margin-bottom: 10px;
  }
  .view {
    padding: 20px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  th {
    background-color: #f2f2f2;
  }
  .pagination {
    margin-top: 10px;
  }
</style>