// Load the production HTML file
const fs = require('fs');
const path = require('path');
// Load the production HTML file
const html = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8');
// Set the HTML content to the document
document.documentElement.innerHTML = html;


const { sum } = require('./app'); // Assuming there's a sum function in app.js

test('sanity', () => {
	expect(1).toBe(1);
});

describe('clearHistory', () => {
	let confirmSpy;
    beforeEach(() => {
		// Add a spy to the window.confirm function
		confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true);
        // Set up localStorage with some test data
        localStorage.setItem('brews', JSON.stringify([
            { id: 0, coffee: 'Test Coffee' }
        ]));
        localStorage.setItem('coffees', JSON.stringify([
            { id: 1, name: 'Test Coffee' }
        ]));
        
        // Trigger the clear everything button click
        const clearHistoryBtn = document.getElementById('clearHistory');
        if (clearHistoryBtn) {
            clearHistoryBtn.click();
        } else {
            console.error('clearHistoryBtn not found');
        }
    });

    test('should clear all brews from localStorage', () => {
        // Check if localStorage is empty
        expect(localStorage.getItem('brews')).toBeNull();
    });

	test('should not clear coffees from localStorage', () => {
		// Check if coffees are still in localStorage
		expect(localStorage.getItem('coffees')).not.toBeNull();
	});
});

// Test the clearEverything button
describe('clearEverything', () => {
	let confirmSpy;
	beforeEach(() => {
		// Add a spy to the window.confirm function
		confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true);
		// Set up localStorage with some test data
		localStorage.setItem('brews', JSON.stringify([
			{ id: 0, coffee: 'Test Coffee' }
		]));
		localStorage.setItem('coffees', JSON.stringify([
			{ id: 1, name: 'Test Coffee' }
		]));
		
		// Trigger the clear everything button click
		const clearEverythingBtn = document.getElementById('clearEverything');
		if (clearEverythingBtn) {
			clearEverythingBtn.click();
		} else {
			console.error('clearEverythingBtn not found');
		}
	});

	test('should clear all coffee and brews from localStorage', () => {
		// Check if localStorage is empty
		expect(localStorage.getItem('brews')).toBeNull();
		expect(localStorage.getItem('coffee')).toBeNull();
	});

});