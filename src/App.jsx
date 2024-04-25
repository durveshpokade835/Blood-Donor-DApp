import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'

// Define the contract ABI and contract address
const contractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "ethAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "bloodGroup",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "location",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "phoneNumber",
				"type": "string"
			}
		],
		"name": "DonorRegistered",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "donorAddresses",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "donors",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "bloodGroup",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "phoneNumber",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "ethAddress",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_ethAddress",
				"type": "address"
			}
		],
		"name": "getDonorByAddress",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getDonorCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_bloodGroup",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_location",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_phoneNumber",
				"type": "string"
			}
		],
		"name": "registerDonor",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

const contractAddress = '0x3dcBdbEf2CaE368E9f29F4B6CB133491EC293287'; // Paste your contract address here

function App() {
	const [web3, setWeb3] = useState(null);
	const [accounts, setAccounts] = useState([]);
	const [contract, setContract] = useState(null);
	const [donorData, setDonorData] = useState([]);
	const [newDonors, setNewDonors] = useState([]);
	const [name, setName] = useState('');
	const [bloodGroup, setBloodGroup] = useState('');
	const [location, setLocation] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');

	useEffect(() => {
		const init = async () => {
			// Connect to MetaMask
			if (window.ethereum) {
				try {
					const web3Instance = new Web3(window.ethereum);
					setWeb3(web3Instance);

					// Request account access if needed
					await window.ethereum.request({ method: 'eth_requestAccounts' });

					// Get the accounts
					const accs = await web3Instance.eth.getAccounts();
					setAccounts(accs);

					// Instantiate the contract
					const instance = new web3Instance.eth.Contract(contractABI, contractAddress);
					setContract(instance);
				} catch (error) {
					console.error('Error connecting to MetaMask or deploying contract', error);
				}
			}
		};
		init();
	}, []);

	// Function to handle donor registration
	const registerDonors = async () => {
		if (!contract) return;
		try {
			// Loop through each new donor and register them
			for (let i = 0; i < newDonors.length; i++) {
				const { name, bloodGroup, location, phoneNumber } = newDonors[i];
				await contract.methods.registerDonor(name, bloodGroup, location, phoneNumber).send({ from: accounts[0] });
			}
			alert('Donors registered successfully!');
			// Clear the input fields and reset the newDonors array
			setName('');
			setBloodGroup('');
			setLocation('');
			setPhoneNumber('');
			setNewDonors([]);
		} catch (error) {
			console.error('Error registering donors', error);
		}
	};

	// Function to fetch all registered donors
	const fetchDonors = async () => {
		if (!contract) return;
		try {
			const count = await contract.methods.getDonorCount().call();
			const donors = [];
			for (let i = 0; i < count; i++) {
				const donorAddress = await contract.methods.donorAddresses(i).call();
				const donor = await contract.methods.getDonorByAddress(donorAddress).call();
				donors.push(donor);
			}
			setDonorData(donors);
		} catch (error) {
			console.error('Error fetching donors', error);
		}
	};

	// Function to add a new donor to the list of new donors
	const addDonor = () => {
		if (name && bloodGroup && location && phoneNumber) {
			setNewDonors([...newDonors, { name, bloodGroup, location, phoneNumber }]);
			// Clear input fields after adding donor
			setName('');
			setBloodGroup('');
			setLocation('');
			setPhoneNumber('');
		} else {
			alert('Please fill in all fields to add a new donor.');
		}
	};

	return (
		<Container fluid className="App">
			<h1 className="mt-4">Blood Donation DApp</h1>
			<Row className="mt-4">
				<Col xs={12} md={6}>
					<div className="form-wrapper">
						<h2>Add New Donor</h2>
						<Form>
							<div style={{ display: "flex", justifyContent: "space-between" }}>
								<Form.Group controlId="formName" style={{ marginRight: "20px" }}>
									<Form.Label>Name:</Form.Label>
									<Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
								</Form.Group>
								<Form.Group controlId="formBloodGroup" style={{ marginRight: "20px" }}>
									<Form.Label>Blood Group:</Form.Label>
									<Form.Control type="text" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} />
								</Form.Group>
								<Form.Group controlId="formLocation" style={{ marginRight: "20px" }}>
									<Form.Label>Location:</Form.Label>
									<Form.Control type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
								</Form.Group>
								<Form.Group controlId="formPhoneNumber">
									<Form.Label>Phone Number:</Form.Label>
									<Form.Control type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
								</Form.Group>
							</div><br />
							<Button variant="primary" onClick={addDonor}>Add Donor</Button>
						</Form>
					</div>
				</Col>
				<Col xs={12} md={6}>
					<div className="new-donors-wrapper">
						<h2>New Donors</h2>
						<ul>
							{newDonors.map((donor, index) => (
								<li key={index}>
									Name: {donor.name}, Blood Group: {donor.bloodGroup}, Location: {donor.location}, Phone Number: {donor.phoneNumber}
								</li>
							))}
						</ul>
						<Button variant="success" onClick={registerDonors}>Register Donors</Button>
					</div>
				</Col>
			</Row>
			<Row className="mt-4">
				<Col>
					<div className="registered-donors-wrapper">
						<h2>Registered Donors</h2>
						<Table className='myTable' striped bordered hover style={{ marginLeft: '40px' }}>
							<thead>
								<tr>
									<th className='Fn'>Ethereum Address</th>
									<th className='Fn'>Name</th>
									<th className='Fn'>Blood Group</th>
									<th className='Fn'>Location</th>
									<th className='Fn'>Phone Number</th>
								</tr>
							</thead>
							<tbody>
								{donorData.map((donor, index) => (
									<tr key={index}>
										<td className='Fn'>{donor[4]}</td>
										<td className='Fn'>{donor[0]}</td>
										<td className='Fn'>{donor[1]}</td>
										<td className='Fn'>{donor[2]}</td>
										<td className='Fn'>{donor[3]}</td>
									</tr>
								))}
							</tbody>
						</Table>
						<Button variant="primary" onClick={fetchDonors}>Fetch Donors</Button>
					</div>
				</Col>
			</Row>
		</Container>
	);
}

export default App;
