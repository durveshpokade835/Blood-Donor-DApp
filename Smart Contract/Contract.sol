// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BloodDonation {
    struct Donor {
        string name;
        string bloodGroup;
        string location;
        string phoneNumber;
        address ethAddress;
    }

    mapping(address => Donor) public donors;
    address[] public donorAddresses;

    event DonorRegistered(address indexed ethAddress, string name, string bloodGroup, string location, string phoneNumber);

    // Function to register a donor
    function registerDonor(string memory _name, string memory _bloodGroup, string memory _location, string memory _phoneNumber) external {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_bloodGroup).length > 0, "Blood group cannot be empty");
        require(bytes(_location).length > 0, "Location cannot be empty");
        require(bytes(_phoneNumber).length > 0, "Phone number cannot be empty");

        // Make sure the donor is not already registered
        require(donors[msg.sender].ethAddress == address(0), "Donor already registered");

        donors[msg.sender] = Donor(_name, _bloodGroup, _location, _phoneNumber, msg.sender);
        donorAddresses.push(msg.sender);

        emit DonorRegistered(msg.sender, _name, _bloodGroup, _location, _phoneNumber);
    }

    // Function to get the count of registered donors
    function getDonorCount() external view returns (uint) {
        return donorAddresses.length;
    }

    // Function to get donor details by address
    function getDonorByAddress(address _ethAddress) external view returns (string memory, string memory, string memory, string memory, address) {
        Donor memory donor = donors[_ethAddress];
        return (donor.name, donor.bloodGroup, donor.location, donor.phoneNumber, donor.ethAddress);
    }
}
