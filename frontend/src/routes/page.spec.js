import '@testing-library/jest-dom';
import { render, fireEvent, waitFor, screen } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import Page from './+page.svelte';
import { axios } from '$lib/config'; // Mock axios

// Mock the axios module
vi.mock('$lib/config', () => ({
	axios: {
		post: vi.fn()
	}
}));

describe('+page.svelte', () => {
	// Test if the component renders correctly
	it('renders the component with upload form and search form', () => {
		const { getByText, getByLabelText, getByPlaceholderText } = render(Page);

		expect(getByText('Upload file')).toBeInTheDocument();
		const fileInput = getByLabelText('Choose File');
		expect(fileInput).toBeInTheDocument();
		const uploadButton = getByText('Upload CSV');
		expect(uploadButton).toBeInTheDocument();

		expect(getByText('View Data')).toBeInTheDocument();
		const searchInput = getByPlaceholderText('Search...');
		expect(searchInput).toBeInTheDocument();
		const searchButton = getByText('Search');
		expect(searchButton).toBeInTheDocument();
	});

	// Test file input change handling
	it('handles file input change', async () => {
		const { getByLabelText } = render(Page);

		// Select the file input
		const fileInput = getByLabelText('Choose File');

		// Create a dummy file
		const file = new File(['dummy content'], 'example.csv', { type: 'text/csv' });

		// Simulate a file input change event
		await fireEvent.change(fileInput, { target: { files: [file] } });

		// Assert that the file input contains the correct file
		expect(fileInput.files[0].name).toBe('example.csv');
	});

	// Test file upload
	it('handles file upload with progress', async () => {
		const { getByText, getByLabelText } = render(Page);

		const fileInput = getByLabelText('Choose File');
		const file = new File(['dummy content'], 'example.csv', { type: 'text/csv' });

		await fireEvent.change(fileInput, { target: { files: [file] } });

		axios.post.mockImplementationOnce(() =>
			Promise.resolve({
				status: 200,
				data: {}
			})
		);

		const uploadButton = getByText('Upload CSV');
		await fireEvent.click(uploadButton);

		expect(axios.post).toHaveBeenCalledWith('/upload', expect.any(FormData), expect.any(Object));
	});

	// Test search functionality
	it('handles search input and triggers fetchRecords', async () => {
		const { getByPlaceholderText, getByText } = render(Page);

		const searchInput = getByPlaceholderText('Search...');
		await fireEvent.input(searchInput, { target: { value: 'test search' } });

		axios.post.mockResolvedValue({
			status: 200,
			data: {
				data: [],
				currentPage: 1,
				totalPages: 1
			}
		});

		await fireEvent.click(getByText('Search'));
		await waitFor(() => {
			expect(axios.post).toHaveBeenCalledWith(
				'/getRecords',
				{
					page: 1,
					limit: 10,
					search: 'test search'
				},
				{ withCredentials: true }
			);
		});
	});
});
