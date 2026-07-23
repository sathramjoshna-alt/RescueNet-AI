// Mock data for RescueNet AI

export const satellites = [
  {
    id: 'SAT-LEO-01',
    name: 'VIASAT-LEO-INDIA-01',
    type: 'LEO',
    orbit: 550,
    lat: 18.5,
    lng: 73.8,
    health: 98,
    signal: 94,
    coverage: 87,
    latency: 28,
    bandwidth: 450,
    battery: 91,
    status: 'active',
    color: '#00d4ff',
  },
  {
    id: 'SAT-LEO-02',
    name: 'VIASAT-LEO-INDIA-02',
    type: 'LEO',
    orbit: 550,
    lat: 22.3,
    lng: 80.1,
    health: 95,
    signal: 89,
    coverage: 82,
    latency: 31,
    bandwidth: 380,
    battery: 88,
    status: 'active',
    color: '#00d4ff',
  },
  {
    id: 'SAT-LEO-03',
    name: 'VIASAT-LEO-INDIA-03',
    type: 'LEO',
    orbit: 550,
    lat: 12.9,
    lng: 77.6,
    health: 91,
    signal: 85,
    coverage: 79,
    latency: 35,
    bandwidth: 320,
    battery: 94,
    status: 'active',
    color: '#00d4ff',
  },
  {
    id: 'SAT-MEO-01',
    name: 'VIASAT-MEO-INDIA-01',
    type: 'MEO',
    orbit: 8000,
    lat: 20.0,
    lng: 78.5,
    health: 99,
    signal: 96,
    coverage: 95,
    latency: 80,
    bandwidth: 800,
    battery: 97,
    status: 'active',
    color: '#a855f7',
  },
  {
    id: 'SAT-MEO-02',
    name: 'VIASAT-MEO-INDIA-02',
    type: 'MEO',
    orbit: 8000,
    lat: 25.0,
    lng: 85.0,
    health: 96,
    signal: 92,
    coverage: 91,
    latency: 88,
    bandwidth: 720,
    battery: 93,
    status: 'active',
    color: '#a855f7',
  },
  {
    id: 'SAT-GEO-01',
    name: 'VIASAT-GEO-INDIA-01',
    type: 'GEO',
    orbit: 35786,
    lat: 0.0,
    lng: 83.0,
    health: 100,
    signal: 99,
    coverage: 99,
    latency: 550,
    bandwidth: 2000,
    battery: 100,
    status: 'active',
    color: '#f59e0b',
  },
];

export const disasterZones = [
  { id: 'DZ-001', type: 'Flood', lat: 22.5726, lng: 88.3639, severity: 'Critical', state: 'West Bengal', victims: 1240, rescued: 456, active: true },
  { id: 'DZ-002', type: 'Cyclone', lat: 20.2961, lng: 85.8245, severity: 'High', state: 'Odisha', victims: 890, rescued: 320, active: true },
  { id: 'DZ-003', type: 'Earthquake', lat: 30.7333, lng: 76.7794, severity: 'High', state: 'Punjab', victims: 340, rescued: 180, active: true },
  { id: 'DZ-004', type: 'Wildfire', lat: 15.2993, lng: 74.1240, severity: 'Medium', state: 'Goa', victims: 120, rescued: 95, active: true },
  { id: 'DZ-005', type: 'Landslide', lat: 27.5330, lng: 88.5122, severity: 'High', state: 'Sikkim', victims: 280, rescued: 140, active: true },
  { id: 'DZ-006', type: 'Flood', lat: 26.8467, lng: 80.9462, severity: 'Medium', state: 'Uttar Pradesh', victims: 560, rescued: 420, active: false },
  { id: 'DZ-007', type: 'Cyclone', lat: 13.0827, lng: 80.2707, severity: 'Low', state: 'Tamil Nadu', victims: 200, rescued: 190, active: false },
];

export const rescueTeams = [
  { id: 'RT-001', name: 'Alpha Strike Team', type: 'Ground Rescue', members: 12, location: 'West Bengal', status: 'Active', victims_rescued: 156, mission: 'Flood Rescue - Kolkata', lat: 22.5726, lng: 88.3639 },
  { id: 'RT-002', name: 'Bravo Medical Unit', type: 'Medical', members: 8, location: 'Odisha', status: 'Active', victims_rescued: 89, mission: 'Cyclone Medical Aid', lat: 20.2961, lng: 85.8245 },
  { id: 'RT-003', name: 'Charlie Dive Team', type: 'Water Rescue', members: 6, location: 'West Bengal', status: 'Active', victims_rescued: 67, mission: 'River Rescue Ops', lat: 22.6726, lng: 88.2639 },
  { id: 'RT-004', name: 'Delta Heli Unit', type: 'Aerial Rescue', members: 4, location: 'Punjab', status: 'Standby', victims_rescued: 45, mission: 'Earthquake Relief', lat: 30.7333, lng: 76.7794 },
  { id: 'RT-005', name: 'Echo Search Team', type: 'Search & Rescue', members: 10, location: 'Sikkim', status: 'Active', victims_rescued: 78, mission: 'Landslide Search', lat: 27.5330, lng: 88.5122 },
  { id: 'RT-006', name: 'Foxtrot Fire Unit', type: 'Firefighting', members: 8, location: 'Goa', status: 'Active', victims_rescued: 34, mission: 'Wildfire Control', lat: 15.2993, lng: 74.1240 },
];

export const drones = [
  { id: 'UAV-001', name: 'Eagle-1', battery: 87, altitude: 120, speed: 65, mission: 'Flood Survey', status: 'Active', thermal: true, nightVision: true, victimsFound: 23, flightTime: 45, successRate: 94, lat: 22.58, lng: 88.35 },
  { id: 'UAV-002', name: 'Falcon-2', battery: 64, altitude: 80, speed: 45, mission: 'Search & Rescue', status: 'Active', thermal: true, nightVision: false, victimsFound: 11, flightTime: 28, successRate: 88, lat: 20.31, lng: 85.82 },
  { id: 'UAV-003', name: 'Hawk-3', battery: 92, altitude: 150, speed: 70, mission: 'Area Mapping', status: 'Active', thermal: false, nightVision: true, victimsFound: 8, flightTime: 62, successRate: 91, lat: 27.54, lng: 88.50 },
  { id: 'UAV-004', name: 'Kite-4', battery: 23, altitude: 0, speed: 0, mission: 'Charging', status: 'Charging', thermal: true, nightVision: true, victimsFound: 19, flightTime: 0, successRate: 96, lat: 30.73, lng: 76.78 },
  { id: 'UAV-005', name: 'Swift-5', battery: 78, altitude: 100, speed: 55, mission: 'Supply Drop', status: 'Active', thermal: false, nightVision: false, victimsFound: 0, flightTime: 35, successRate: 89, lat: 15.30, lng: 74.12 },
];

export const victims = [
  { id: 'VIC-001', name: 'Priya Sharma', age: 34, location: 'Kolkata North', priority: 'Critical', medical: 'Head Injury', lat: 22.58, lng: 88.36, status: 'Awaiting Rescue', satellite: 'LEO-01' },
  { id: 'VIC-002', name: 'Rajan Kumar', age: 67, location: 'Cuttack District', priority: 'High', medical: 'Elderly - Exhaustion', lat: 20.45, lng: 85.87, status: 'Rescue In Progress', satellite: 'MEO-01' },
  { id: 'VIC-003', name: 'Baby Meera', age: 0.5, location: 'Gangtok Suburbs', priority: 'Critical', medical: 'Infant - Hypothermia', lat: 27.53, lng: 88.51, status: 'Awaiting Rescue', satellite: 'LEO-02' },
  { id: 'VIC-004', name: 'Sunita Devi', age: 28, location: 'Bhubaneswar', priority: 'High', medical: 'Pregnant - 8 Months', lat: 20.30, lng: 85.83, status: 'Rescued', satellite: 'GEO-01' },
  { id: 'VIC-005', name: 'Arjun Singh', age: 12, location: 'Ludhiana', priority: 'High', medical: 'Child - Fracture', lat: 30.90, lng: 75.85, status: 'Rescue In Progress', satellite: 'MEO-01' },
  { id: 'VIC-006', name: 'Mohammed Rafi', age: 45, location: 'Panaji', priority: 'Medium', medical: 'Smoke Inhalation', lat: 15.50, lng: 73.83, status: 'Rescued', satellite: 'LEO-03' },
  { id: 'VIC-007', name: 'Lakshmi Iyer', age: 72, location: 'Chennai', priority: 'High', medical: 'Elderly - Cardiac Risk', lat: 13.09, lng: 80.27, status: 'Rescued', satellite: 'GEO-01' },
  { id: 'VIC-008', name: 'Deepak Nair', age: 38, location: 'West Bengal', priority: 'Medium', medical: 'Flood - Minor injuries', lat: 22.45, lng: 88.40, status: 'Awaiting Rescue', satellite: 'LEO-01' },
];

export const iotSensors = [
  { id: 'IOT-001', name: 'River Sensor - Hooghly', type: 'River Level', value: 8.7, unit: 'm', threshold: 7.5, status: 'Critical', location: 'West Bengal', lat: 22.57, lng: 88.36 },
  { id: 'IOT-002', name: 'Rain Gauge - Bhubaneswar', type: 'Rainfall', value: 185, unit: 'mm/hr', threshold: 150, status: 'Warning', location: 'Odisha', lat: 20.30, lng: 85.82 },
  { id: 'IOT-003', name: 'Seismograph - Chandigarh', type: 'Earthquake', value: 4.2, unit: 'Richter', threshold: 4.0, status: 'Warning', location: 'Punjab', lat: 30.73, lng: 76.78 },
  { id: 'IOT-004', name: 'Gas Sensor - Panaji', type: 'Gas Leakage', value: 320, unit: 'ppm', threshold: 200, status: 'Critical', location: 'Goa', lat: 15.49, lng: 73.82 },
  { id: 'IOT-005', name: 'Air Quality - Mumbai', type: 'Air Quality', value: 187, unit: 'AQI', threshold: 150, status: 'Warning', location: 'Maharashtra', lat: 19.08, lng: 72.88 },
  { id: 'IOT-006', name: 'Temp Sensor - Gangtok', type: 'Temperature', value: 4.2, unit: '°C', threshold: 5.0, status: 'Warning', location: 'Sikkim', lat: 27.33, lng: 88.51 },
  { id: 'IOT-007', name: 'Wind Sensor - Chennai', type: 'Wind Speed', value: 95, unit: 'km/h', threshold: 80, status: 'Warning', location: 'Tamil Nadu', lat: 13.08, lng: 80.27 },
  { id: 'IOT-008', name: 'Humidity - Assam', type: 'Humidity', value: 94, unit: '%', threshold: 90, status: 'Normal', location: 'Assam', lat: 26.14, lng: 91.74 },
];

export const weatherData = {
  current: {
    temperature: 32,
    humidity: 84,
    windSpeed: 67,
    windDirection: 'NE',
    pressure: 998,
    visibility: 3.2,
    rainfall: 45,
    condition: 'Heavy Rain',
    alert: 'Cyclone Warning',
  },
  forecast: [
    { day: 'Today', high: 34, low: 28, condition: 'Cyclone', rainfall: 120 },
    { day: 'Tomorrow', high: 31, low: 26, condition: 'Heavy Rain', rainfall: 85 },
    { day: 'Day 3', high: 29, low: 24, condition: 'Moderate Rain', rainfall: 45 },
    { day: 'Day 4', high: 33, low: 27, condition: 'Partly Cloudy', rainfall: 10 },
    { day: 'Day 5', high: 35, low: 29, condition: 'Sunny', rainfall: 0 },
  ],
};

export const missionTimeline = [
  { id: 1, event: 'Disaster Detected', time: '06:14 AM', status: 'completed', desc: 'Flood sensors triggered in West Bengal' },
  { id: 2, event: 'Satellite Connected', time: '06:16 AM', status: 'completed', desc: 'VIASAT-LEO-01 established link' },
  { id: 3, event: 'AI Analysis Complete', time: '06:18 AM', status: 'completed', desc: 'Threat level: CRITICAL, 1240 affected' },
  { id: 4, event: 'SOS Received', time: '06:22 AM', status: 'completed', desc: '34 SOS signals from flood zones' },
  { id: 5, event: 'Drone Dispatched', time: '06:25 AM', status: 'completed', desc: 'Eagle-1 and Falcon-2 deployed' },
  { id: 6, event: 'Rescue Team Assigned', time: '06:30 AM', status: 'completed', desc: 'Alpha Strike & Charlie Dive dispatched' },
  { id: 7, event: 'Victim Located', time: '07:45 AM', status: 'completed', desc: '156 victims located via thermal imaging' },
  { id: 8, event: 'Victim Rescued', time: '09:15 AM', status: 'active', desc: '456 rescued, operations ongoing' },
  { id: 9, event: 'Mission Completed', time: 'ETA 18:00', status: 'pending', desc: 'Estimated completion based on AI projection' },
];

export const analyticsData = {
  satelliteUsage: {
    labels: ['LEO', 'MEO', 'GEO'],
    data: [54, 28, 18],
  },
  missionSuccess: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [82, 87, 91, 89, 94, 96],
  },
  responseTime: {
    labels: ['0-5min', '5-10min', '10-20min', '20-30min', '>30min'],
    data: [23, 41, 28, 6, 2],
  },
  networkLatency: {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    leo: [28, 30, 35, 29, 32, 27],
    meo: [82, 85, 88, 80, 84, 79],
    geo: [540, 555, 548, 560, 545, 552],
  },
  bandwidthUsage: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [340, 420, 890, 760, 450, 380, 310],
  },
  rescueStats: {
    total: 3630,
    rescued: 2100,
    pending: 1530,
    critical: 234,
  },
};

export const aiPredictions = [
  { id: 1, disaster: 'Flood', location: 'Bihar', risk: 87, confidence: 91, expectedImpact: 'High', affectedPop: 45000, damage: '₹2,340 Cr', timeframe: '24-48 hours' },
  { id: 2, disaster: 'Cyclone', location: 'Andhra Pradesh', risk: 72, confidence: 84, expectedImpact: 'Severe', affectedPop: 120000, damage: '₹8,900 Cr', timeframe: '36-72 hours' },
  { id: 3, disaster: 'Landslide', location: 'Uttarakhand', risk: 65, confidence: 78, expectedImpact: 'Moderate', affectedPop: 8500, damage: '₹450 Cr', timeframe: '12-24 hours' },
  { id: 4, disaster: 'Wildfire', location: 'Himachal Pradesh', risk: 54, confidence: 71, expectedImpact: 'Moderate', affectedPop: 3200, damage: '₹180 Cr', timeframe: '48-96 hours' },
  { id: 5, disaster: 'Earthquake', location: 'Gujarat', risk: 41, confidence: 62, expectedImpact: 'Low-Moderate', affectedPop: 15000, damage: '₹670 Cr', timeframe: '72-168 hours' },
];

export const offlineMessages = [
  { id: 1, from: 'RT-001 Alpha', message: 'Sector 7 cleared, moving to sector 8', time: '09:12', status: 'delivered' },
  { id: 2, from: 'UAV-001 Eagle', message: 'Thermal detected 5 signatures at GPS 22.58, 88.36', time: '09:15', status: 'delivered' },
  { id: 3, from: 'IOT-Hooghly', message: 'Water level rising 0.3m/hr', time: '09:18', status: 'delivered' },
  { id: 4, from: 'RT-003 Charlie', message: 'Boat rescue completed, 12 victims secured', time: '09:22', status: 'queued' },
  { id: 5, from: 'Base Command', message: 'Reinforcements dispatched from Kolkata base', time: '09:25', status: 'queued' },
  { id: 6, from: 'Medical Unit', message: 'Field hospital at capacity, need additional supplies', time: '09:28', status: 'queued' },
];
