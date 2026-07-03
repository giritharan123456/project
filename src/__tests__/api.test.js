import { describe, test, expect } from 'vitest';
import { authAPI, districtsAPI, areasAPI, explorerAPI } from '../services/api';

const API_BASE = import.meta.env.VITE_API_URL;

describe('API service - client configuration', () => {
  test('authAPI has all required methods', () => {
    expect(authAPI.register).toBeInstanceOf(Function);
    expect(authAPI.login).toBeInstanceOf(Function);
    expect(authAPI.guestLogin).toBeInstanceOf(Function);
    expect(authAPI.getProfile).toBeInstanceOf(Function);
    expect(authAPI.updateProfile).toBeInstanceOf(Function);
  });

  test('areasAPI has all required methods', () => {
    expect(areasAPI.getAll).toBeInstanceOf(Function);
    expect(areasAPI.getById).toBeInstanceOf(Function);
    expect(areasAPI.getByPincode).toBeInstanceOf(Function);
    expect(areasAPI.getByDistrict).toBeInstanceOf(Function);
  });

  test('explorerAPI has all required methods', () => {
    expect(explorerAPI.getCategories).toBeInstanceOf(Function);
    expect(explorerAPI.getLeaderboard).toBeInstanceOf(Function);
    expect(explorerAPI.getMatrix).toBeInstanceOf(Function);
    expect(explorerAPI.getEstimate).toBeInstanceOf(Function);
  });

  test('API_BASE is configured', () => {
    expect(API_BASE).toBeDefined();
    expect(typeof API_BASE).toBe('string');
    expect(API_BASE.length).toBeGreaterThan(0);
  });
});
