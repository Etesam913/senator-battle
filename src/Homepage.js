import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import styled from "styled-components";
import { Router, Link } from "@reach/router";
import "./HomepageCSS.css";
import ComparisonPage from "./ComparisonPage";
import { Mobile, Desktop, Tablet } from 'react-responsive-simple';
import {Helmet} from 'react-helmet';
import Sword from './sword.png'
import * as d3 from "d3-fetch";
const Page = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const SearchBar = styled.input`
    width: 9rem;
    height: 1.5rem;
    border-radius: 4px;
    padding-left: 5px;
    padding-right: 5px;
    border: none;
    background-color:#e4e5e3;
    color: #313131;
    border: none;
    margin-left: .5rem;
    margin-right: .5rem;
    font-size: .85rem;
    margin-bottom: .5rem;
`;
const SearchContainer = styled.div`
    display: flex;
    margin-top: 1rem;
    margin-bottom: 1rem;
`;
const Description = styled.div`
    font-size: ${props => props.fontSize};
    text-align: center;
    padding-left: 1rem;
    padding-right: 1rem;
`;
const NamesContainer = styled.div`
    overflow: scroll;
    height: 10rem;
    font-weight: normal;
    text-align: left;
    border-style: solid;
    border-radius: 10px;
    border-width: 2px;
`;
function Homepage() {
    var [senator1Name, setSenator1name] = useState("");
    var [senator2Name, setSenator2name] = useState("");
    var [senatorNames, setSenatorNames] = useState([]);
    let senatorNamesTemp = [];
    let names = senatorNames.map((props) => <li>{props}</li>);
    const request = require('request');
    var EventEmitter = require("events").EventEmitter;
    var memberName = new EventEmitter;
    useEffect(() => {
        let options = {
            url: 'https://api.propublica.org/congress/v1/116/senate/members.json',
            headers: {
                'X-API-Key': 'yoMyvDt0KAspvDWKz8xbfMwNyxMPXfxZw5bPe4Ih'
            },
            json: true
        };
        request(options, function (err, res, json) {
            if (err) {
                if (err.name == 'NetworkError') {
                    console.log('There was a network error.');
                }

            }
            console.log(1);
            memberName.data = JSON.stringify(json);
            memberName.emit('retrieveNames');
        }
        );
        memberName.on('retrieveNames', function () {
            console.log(memberName.data);
            var parsedData = JSON.parse(memberName.data);
            getNames(parsedData);
        })
        function getNames(parsedData) {
            for (let i = 0; i < parsedData.results[0].members.length; i++) {
                senatorNamesTemp.push((parsedData.results[0].members[i].first_name + " " + parsedData.results[0].members[i].last_name).toLowerCase().trim());
            }
            setSenatorNames(senatorNamesTemp);
            //console.log(senatorNamesTemp);
        }
    }, [])

    useEffect(() => {
        //names = senatorNames.map((props)=> <li>{props}</li>);

    }, [senatorNames])
    function handleChange(e, identifier) {
        if (identifier === 1) {
            setSenator1name(e.target.value);
        }
        else if (identifier === 2) {
            setSenator2name(e.target.value);
        }
    }
    function search() {
        let oneNameFound = false;
        for (let i = 0; i < senatorNames.length; i++) {
            if ((senatorNames[i] === senator1Name.toLowerCase().trim() && !oneNameFound) || (senatorNames[i] === senator2Name.toLowerCase().trim() && !oneNameFound)) {
                oneNameFound = true;
            }
            else if ((senatorNames[i] === senator1Name.toLowerCase().trim() && oneNameFound) || (senatorNames[i] === senator2Name.toLowerCase().trim() && oneNameFound)) {

                return (
                    <div>
                        <ComparisonPage name1={senator1Name} name2={senator2Name} />
                        <div style={{ textAlign: 'center' }}><Link className="redirectV2" to="/">Back To Homepage > </Link></div>
                    </div>
                );
            }
        }
        return (
            <div>
                <div style={{ marginTop: "1rem", textAlign: 'center', marginBottom: "1rem" }}>Senator Not Found</div>
                <div><Link style={{ textAlign: 'center' }} className="redirect" to="/">Back To Homepage > </Link></div>
            </div>

        );
    }
    const Home = () => (
        <div className="home">
            <motion.h1>Senator Battle</motion.h1>
            <Desktop>
                <Description fontSize="1.25rem">
                    <div style={{ marginBottom: ".75rem" }}>Have you ever wanted to see how U.S. senators would fare in a one on one duel?</div>
                    <div style={{ marginBottom: ".75rem" }}>Type in the names of two senators and you can see who will come out on top!</div>
                </Description>
            </Desktop>
            <Tablet>
                <Description fontSize="1.25rem">
                    <div style={{ marginBottom: ".75rem" }}>Have you ever wanted to see how U.S. senators would fare in a one on one duel?</div>
                    <div style={{ marginBottom: ".75rem" }}>Type in the names of two senators and you can see who will come out on top!</div>
                </Description>
            </Tablet>
            <Mobile>
                <Description fontSize="1rem">
                    <div style={{ marginBottom: ".75rem" }}>Have you ever wanted to see how U.S. senators would fare in a one on one duel?</div>
                    <div style={{ marginBottom: ".75rem" }}>Type in the names of two senators and you can see who will come out on top!</div>
                </Description>
            </Mobile>


        </div>

    );
    const Comparison = () => (
        <div>{search()}</div>
    );
    return (
        <Page>
        <Helmet>
            <title>Senator Battle</title>
            <link rel="icon" href={Sword} />
        </Helmet>
            <Router>
                <Home path="/" />
            </Router>
            <SearchContainer>
                <form>
                    <SearchBar type="text" value={senator1Name} onChange={(event, ) => { handleChange(event, 1); }} />
                    vs
                <SearchBar type="text" value={senator2Name} onChange={(event, ) => { handleChange(event, 2); }} />
                </form>
            </SearchContainer>
            <Link className="redirect" to="/Comparison">Go To Matchup ></Link>
            <Router>
                <Comparison path="/Comparison" />
            </Router>
            <div style={{textAlign: "center", fontWeight:"bold", marginTop:"1rem"}}> Senator Names
                <NamesContainer>
                    <ul>{names}</ul>
                </NamesContainer>
            </div>
        </Page>
    );
}
export default Homepage;