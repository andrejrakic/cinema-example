import { ethers } from 'hardhat';
import { Cinema, Cinema__factory } from '../typechain-types';
import { parseEther } from 'ethers/lib/utils';
import { constants, Signer, BigNumber } from 'ethers';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { assert, expect } from 'chai';

describe('Cinema tests', async function () {
	async function deployCinemaFixture() {
		const price = parseEther('1');

		const CinemaFactory: Cinema__factory = await ethers.getContractFactory(
			'Cinema'
		);
		const cinemaContract: Cinema = await CinemaFactory.deploy(
			price,
			constants.AddressZero
		);

		await cinemaContract.deployed();

		return { cinemaContract };
	}

	let cinema: Cinema;
	let buyer: Signer;

	beforeEach(async function () {
		const { cinemaContract } = await loadFixture(deployCinemaFixture);

		const [wallet1, wallet2, wallet3] = await ethers.getSigners();

		cinema = cinemaContract;
		buyer = wallet1;
	});

	describe('#buyTicket', async function () {
		describe('success', async function () {
			it('should buy a ticket', async function () {
				const amount = await cinema.getPrice();
				await cinema.connect(buyer).buyTicket(amount);

				const hadBoughtTicket = await cinema.hadBoughtTicket(
					await buyer.getAddress()
				);

				assert(hadBoughtTicket === true, 'hadBoughtTicket not set');
			});

			it('should emit proper event', async function () {
				const amount = await cinema.getPrice();
				await expect(cinema.connect(buyer).buyTicket(amount))
					.to.emit(cinema, 'NewBuyer')
					.withArgs(await buyer.getAddress());
			});
		});

		describe('failure', async function () {
			it('should prevent buyer from buying multiple tickets', async function () {
				const amount = await cinema.getPrice();
				await cinema.connect(buyer).buyTicket(amount);

				await expect(
					cinema.connect(buyer).buyTicket(amount)
				).to.be.revertedWith('Already bought the ticket');
			});

			it('should revert if amount is less than price', async function () {
				const price = await cinema.getPrice();
				const amount = price.sub(BigNumber.from('1'));

				await expect(
					cinema.connect(buyer).buyTicket(amount)
				).to.be.revertedWithCustomError(cinema, 'AmountTooLow');
			});
		});
	});
});
