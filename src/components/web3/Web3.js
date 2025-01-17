import Web3 from "web3";
import ElectionAbi from "../../blockchain/build/contracts/Election.json";

export const connectDefault = async () => {
	if (window.ethereum) {
		await window.ethereum.request({ method: "eth_requestAccounts" });
		window.web3 = new Web3(window.ethereum);
	} else if (window.web3) {
		window.web3 = new Web3(window.web3.currentProvider);
	} else {
		window.alert(
			"Non-Ethereum Browser detected, install metamask to continue to the voting process.",
		);
	}
};

const loadContract = async () => {
	const web3 = window.web3;
	const networkID = await web3.eth.net.getId();
	const networkData = ElectionAbi.networks[networkID];

	if (networkData) {
		const election = new web3.eth.Contract(
			ElectionAbi.abi,
			networkData.address,
		);
		return election;
	} else {
		window.alert(
			"Smart Contract couldn't be deployed contact the IT Department",
		);
	}
};

const voterAddress = "0xc2A3cB7d4BF24e456051E3a710057ac61f5dB133";

export const loadVoterAccount = async (votername, voterID, phonenumber) => {
	const election = await loadContract();
	// const accounts = await window.web3.eth.getAccounts();

	try {
		await election.methods
			.voterLogin(votername, voterID, phonenumber)
			.send({ from: voterAddress })
			.on("transactionhash", () => {
				window.alert("Login is being processed. Please wait.");
			});
	} catch (error) {
		console.log(error.message);
	}
};

export const vote = async (candidateName) => {
	const election = await loadContract();
	// const accounts = await window.web3.eth.getAccounts();
	// const voterAddress = accounts[0];
	const voter = await election.methods
	.voters(voterAddress)
	.call((error, result) => {
		console.log(result);
		window.alert(result);
	});

	if (voter[4] === true) {
		window.alert(
			"The address " +
				{ voterAddress } +
				" has already voted, this window will close now.",
		);
		window.close();
	} else {
		await election.methods
			.vote(candidateName)
			.send({ from: voterAddress })
			.on("transactionhash", () => {
				console.log("Vote Success");
			});
		window.alert(
			"Vote has successfully been recorded, you will be redirected to the home page.",
		);
	}
};
