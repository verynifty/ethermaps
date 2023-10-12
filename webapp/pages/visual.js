import { default as React, useState, useEffect } from 'react';

import Head from 'next/head'

import { Puck } from "puck";
import "@measured/puck/dist/index.css";

import ContractWrite from 'components/render/contractWrite';


import { ButtonGroup, ButtonGroupProps } from "components/visualblocks/ButtonGroup";
import { Card, CardProps } from "components/visualblocks/Card";
import { Columns, ColumnsProps } from "components/visualblocks/Columns";
import { Hero, HeroProps } from "components/visualblocks/Hero";
import { Heading, HeadingProps } from "components/visualblocks/Heading";
import { Flex, FlexProps } from "components/visualblocks/Flex";
import { Logos, LogosProps } from "components/visualblocks/Logos";
import { Stats, StatsProps } from "components/visualblocks/Stats";
import { Text, TextProps } from "components/visualblocks/Text";
import { VerticalSpace, VerticalSpaceProps } from "components/visualblocks/VerticalSpace";


// Create puck component config
const config = {
    components: {
        ButtonGroup,
        Card,
        Columns,
        Hero,
        Heading,
        Flex,
        Logos,
        Stats,
        Text,
        VerticalSpace, 
        ContractWrite: {
            fields: {
                abi: { type: "text" },
                address: { type: "text" },

            },
            defaultProps: {
                abi:     `{
                    "constant": false,
                    "inputs": [
                        {
                            "name": "_to",
                            "type": "address"
                        },
                        {
                            "name": "_value",
                            "type": "uint256"
                        }
                    ],
                    "name": "transfer",
                    "outputs": [
                        {
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                }`,
                address: "0xb6ca7399b4f9ca56fc27cbff44f4d2e4eef1fc81"
            },
            render: ({ abi, address }) => (
                <div>
                    <ContractWrite address={address} abi={[JSON.parse(abi)]} />
                </div>
            ),
        }
    },
};

// Describe the initial data
const initialData = {
    content: [],
    root: {},
};

// Save the data to your database
const save = (data) => { };


export default function Visual() {
    return (
        <React.Fragment>
            <Head>
                <link href="https://cdn.jsdelivr.net/npm/daisyui@3.1.1/dist/full.css" rel="stylesheet" type="text/css" />
                <script src="https://cdn.tailwindcss.com"></script>
            </Head>
            <Puck config={config} data={initialData} onPublish={save} />
        </React.Fragment>
    )
}
