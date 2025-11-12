/**
 * Location Page Object for K6 Performance Tests
 * Expense Management API - Location Operations
 * 
 * This class handles location-related API operations
 */

import { BasePage } from './BasePage.js';
import { CONFIG } from '../config/config.js';
import { ResponseValidator, DataGenerator } from '../utils/helpers.js';

export class LocationPage extends BasePage {
  
  /**
   * Get all locations
   * @param {String} token - Authentication token
   * @param {Object} filters - Filter parameters
   * @returns {Object} HTTP response
   */
  getLocations(token, filters = {}) {
    console.log('📍 Getting locations...');
    
    const response = this.get(
      CONFIG.ENDPOINTS.LOCATIONS,
      this.getAuthHeaders(token),
      filters
    );
    
    ResponseValidator.validateGetResponse(response, 'Get Locations');
    
    if (response.status === 200) {
      try {
        const locations = JSON.parse(response.body);
        const count = Array.isArray(locations) ? locations.length : locations.count || 'Unknown';
        console.log(`✅ Retrieved ${count} locations`);
      } catch (e) {
        console.error('❌ Failed to parse locations data');
      }
    }
    
    return response;
  }
  
  /**
   * Create new location
   * @param {String} token - Authentication token
   * @param {Object} locationData - Location data (optional, will generate random if not provided)
   * @returns {Object} HTTP response
   */
  createLocation(token, locationData = null) {
    const location = locationData || DataGenerator.randomLocation();
    
    console.log(`🏢 Creating location: ${location.name} in ${location.city}`);
    
    const response = this.post(
      CONFIG.ENDPOINTS.LOCATIONS,
      location,
      this.getAuthHeaders(token)
    );
    
    ResponseValidator.validatePostResponse(response, 'Create Location');
    
    if (response.status === 201 || response.status === 200) {
      try {
        const createdLocation = JSON.parse(response.body);
        console.log(`✅ Created location with ID: ${createdLocation.id || createdLocation._id || 'Unknown'}`);
        return { ...response, createdLocation };
      } catch (e) {
        console.error('❌ Failed to parse created location data');
      }
    }
    
    return response;
  }
  
  /**
   * Update location
   * @param {String} token - Authentication token
   * @param {Object} updateData - Update data
   * @returns {Object} HTTP response
   */
  updateLocation(token, updateData) {
    console.log(`📝 Updating location: ${updateData.name || 'Unknown'}`);
    
    const response = this.put(
      CONFIG.ENDPOINTS.LOCATIONS,
      updateData,
      this.getAuthHeaders(token)
    );
    
    ResponseValidator.validatePutResponse(response, 'Update Location');
    
    if (response.status === 200) {
      console.log(`✅ Successfully updated location`);
    }
    
    return response;
  }
  
  /**
   * Delete location
   * @param {String} token - Authentication token
   * @param {String} locationId - Location ID to delete
   * @returns {Object} HTTP response
   */
  deleteLocation(token, locationId) {
    console.log(`🗑️ Deleting location: ${locationId}`);
    
    const response = this.delete(
      `${CONFIG.ENDPOINTS.LOCATIONS}/${locationId}`,
      this.getAuthHeaders(token)
    );
    
    ResponseValidator.validateDeleteResponse(response, 'Delete Location');
    
    if (response.status === 200 || response.status === 204) {
      console.log(`✅ Successfully deleted location: ${locationId}`);
    }
    
    return response;
  }
  
  /**
   * Get location by ID
   * @param {String} token - Authentication token
   * @param {String} locationId - Location ID
   * @returns {Object} HTTP response
   */
  getLocationById(token, locationId) {
    console.log(`🔍 Getting location: ${locationId}`);
    
    const response = this.get(
      `${CONFIG.ENDPOINTS.LOCATIONS}/${locationId}`,
      this.getAuthHeaders(token)
    );
    
    ResponseValidator.validateGetResponse(response, 'Get Location By ID');
    
    if (response.status === 200) {
      try {
        const location = JSON.parse(response.body);
        console.log(`✅ Retrieved location: ${location.name || 'Unknown'}`);
      } catch (e) {
        console.error('❌ Failed to parse location data');
      }
    }
    
    return response;
  }
  
  /**
   * Get cities by country
   * @param {String} token - Authentication token
   * @param {String} countryCode - Country code or name
   * @returns {Object} HTTP response
   */
  getCitiesByCountry(token, countryCode) {
    console.log(`🏙️ Getting cities for country: ${countryCode}`);
    
    const response = this.get(
      CONFIG.ENDPOINTS.CURRENCIES.replace('/currency', '/cities'),
      this.getAuthHeaders(token),
      { country: countryCode }
    );
    
    ResponseValidator.validateGetResponse(response, 'Get Cities By Country');
    
    if (response.status === 200) {
      try {
        const cities = JSON.parse(response.body);
        const count = Array.isArray(cities) ? cities.length : cities.count || 'Unknown';
        console.log(`✅ Retrieved ${count} cities for ${countryCode}`);
      } catch (e) {
        console.error('❌ Failed to parse cities data');
      }
    }
    
    return response;
  }
  
  /**
   * Get all countries
   * @param {String} token - Authentication token
   * @returns {Object} HTTP response
   */
  getCountries(token) {
    console.log('🌍 Getting all countries...');
    
    const response = this.get(
      CONFIG.ENDPOINTS.CURRENCIES.replace('/currency', '/countries'),
      this.getAuthHeaders(token)
    );
    
    ResponseValidator.validateGetResponse(response, 'Get Countries');
    
    if (response.status === 200) {
      try {
        const countries = JSON.parse(response.body);
        const count = Array.isArray(countries) ? countries.length : countries.count || 'Unknown';
        console.log(`✅ Retrieved ${count} countries`);
      } catch (e) {
        console.error('❌ Failed to parse countries data');
      }
    }
    
    return response;
  }
}

export default LocationPage;