import { Responder } from '../Oracle/Responder';

const responder = new Responder();
responder.getResponse().then(() => { process.exit(0); });