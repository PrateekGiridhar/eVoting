//SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

contract Election{

    struct Voter {

        string voterName;
        string voterID;
        string phoneNumber;
        address voterAddress;
        bool voted;
        string vote;

    }
  

    address public admin;
    uint public voterCount;
    mapping(address => Voter) public voters;
    
    
    constructor() {

        admin = msg.sender;
        voterCount = 0;
        
    }

    //The modifier or a constraint tracker which defines the function that can be executed by the admin only.
    modifier onlyAdmin {
        require(msg.sender == admin);
        _;
    }

    //The modifier which makes sure that only voter can access(Prateek's part)
    modifier onlyVoter {
        require(msg.sender != admin);
        _;
    }


    function voterLogin(string memory _voterName, string memory _voterID, string memory _phoneNumber) public onlyVoter {
         
        
        voters[msg.sender].voterName = _voterName;
        voters[msg.sender].voterID = _voterID;
        voters[msg.sender].phoneNumber = _phoneNumber;
        voters[msg.sender].voterAddress = msg.sender;
        voters[msg.sender].voted = false;
        voterCount++;


    }
    

    function vote(string memory _candidateName) public onlyVoter {
     
        require(!voters[msg.sender].voted, "Voter can vote only once.");
        voters[msg.sender].voted = true;
        voters[msg.sender].vote = _candidateName;
        
    }


}