import { default as React, useState, useRef, useEffect } from 'react';
import { Web3Storage } from 'web3.storage'
var hash = require('object-hash');
import { useRouter } from 'next/router'
import axios from 'axios';
import { NFTStorage, File } from 'nft.storage'

const Publish = (props) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN })
    const nftstorage = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN })
    const router = useRouter()
    const [IPFS, setIPFS] = React.useState("");
    const [pageLink, setPageLink] = React.useState("");
    const [isUploaded, setIsUploaded] = React.useState(false);

    useEffect(() => {

    }, []);

    async function upload() {
        setIsLoading(true);
        const obj = { content: props.content }
        const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' })
        const cid = await nftstorage.storeBlob(blob)
        console.log("CID", cid);
        let filename = hash(obj) + '.json';
        let path = "ipfs://" + cid;
        await new Promise(r => setTimeout(r, 3000));


        let file_url = "https://" + cid + ".ipfs.nftstorage.link";
        setIPFS(path)
        setPageLink("https://fastdapp.xyz/app/" + encodeURIComponent(path))
        setIsLoading(false);
        setIsUploaded(true);


    }

    function content() {
        if (isUploaded) {
            return (
                <div>
                    <center><h3 className="text-lg font-bold">Your app is published 🥳</h3></center>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">IPFS Link:</span>
                        </label>
                        <input type="text" placeholder="Type here" className="input input-bordered w-full" value={IPFS} />
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Page Link:</span>
                        </label>
                        <input type="text" placeholder="Type here" className="input input-bordered w-full" value={pageLink} />
                    </div>
                    <a href={pageLink} className="btn mt-4 w-full">Go to your app</a>
                    <div class="mt-2 mb-2 flex flex-col w-full">
                        <div class="divider"></div>
                    </div>
                    <button onClick={() => setIsUploaded(false)} className="btn w-full">Publish again</button>

                </div>
            )
        }
        else if (isLoading) {
            return (
                <div>
                    <center><h3 className="text-lg font-bold">Publish your app</h3>
                        <p className='m-4'>You're about to publish your app and make it shareable with others.</p>

                        <button
                            className="btn w-full" disabled="disabled"
                        >
                            Publishing<span className="loading loading-spinner loading-md"></span>
                        </button>
                    </center>
                </div>
            )
        } else {
            return (
                <div>
                    <center><h3 className="text-lg font-bold">Publish your app</h3>
                        <p className='m-4'>You're about to publish your app and make it shareable with others.</p>

                        <button
                            onClick={upload}
                            className="btn w-full"
                        >
                            Publish
                        </button>
                    </center>

                </div>
            )
        }
    }
    return (
        <div>
            <input type="checkbox" id="my_modal_7" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    {content()}
                </div>
                <label className="modal-backdrop" for="my_modal_7">Close</label>
            </div>
        </div>
    );
}

export default Publish;