import { Fragment } from 'react'
import Link from 'next/link'
import { Popover, Transition } from '@headlessui/react'
import clsx from 'clsx'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'
import { NavLink } from '@/components/NavLink'
import { default as React, useState, useRef, useEffect } from 'react';

import { ConnectButton } from '@rainbow-me/rainbowkit';

import Image from 'next/image'
import logo from '@/images/logo.svg'

const Header = (props) => {

  function getLogo() {
    if (props.headerLogo != null && props.headerLogo != "") {
      return <img className='m-l-5 h-12 w-auto' src={props.headerLogo} />
    }
    else {
      return <Image className='m-l-5 h-12 w-auto' src={logo} />
    }
  }
  function getLogoLink() {
    if (props.headerLogoLink != null && props.headerLogoLink != "") {
      return props.headerLogoLink
    }
    else {
      return "/"
    }
  }

  function getLinksMobile() {
    if (props.headerLinks != null && props.headerLinks != "") {
      console.log(Object.entries(props.headerLinks))
      return (
        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          {Object.entries(props.headerLinks).map((item) => {
            return <li key={item[0]}><a href={item[1]}>{item[0]}</a></li>
          })}
        </ul>
      )
    }
    else {
      return (
        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li><a href="/editor">✍ Editor</a></li>
          <li><a href="https://docs.fastdapp.xyz/docs/intro" target='_blank'>📖 Docs</a></li>
          <li><a href="/wizard" >Wizard</a></li>
        </ul>
      )
    }
  }

  function getLinks() {
    if (props.headerLinks != null && props.headerLinks != "") {
      console.log(Object.entries(props.headerLinks))
      Object.entries(props.headerLinks).map((item) => {
        console.log("BBB", item)
      })
      return (
        <ul className="menu menu-horizontal px-1">
          {Object.entries(props.headerLinks).map((item) => {
            return <li key={item[0]}><a href={item[1]}>{item[0]}</a></li>
          })}
        </ul>
      )
    }
    else {
      return (
        <ul className="menu menu-horizontal px-1">
          <li><a href="/editor">Editor</a></li>
          <li><a href="https://docs.fastdapp.xyz/docs/intro" target='_blank'>Docs</a></li>
          <li><a href="/wizard">Wizard</a></li>
        </ul>
      )
    }
  }

  return (
    <div className="navbar h-16 bg-base" >
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
          </label>
          {getLinksMobile()}
        </div>
        <a href={getLogoLink()}>{getLogo()}</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        {getLinks()}
      </div>
      <div className="navbar-end">
        <ConnectButton />
      </div>
    </div>
  )
}

export default Header;