import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from "framer-motion";
import styled from "styled-components";
import * as d3 from "d3-fetch";
import { tsConstructorType } from '@babel/types';
import PicsJSON from './ProfilePics.json';
import Ratings from './SenatorRatings.json';
import Checkmark from './checkmark.png';
import media from "./media";
import Sword from './sword.png'
import { MobileAndTablet, Desktop, Tablet } from 'react-responsive-simple';
const Subtitle = styled(motion.div)`
  font-weight: bold;
  font-size: 1.2rem;
  margin: .75rem;
  text-align: center;
  ${media.tablet`
    font-size: 1rem;
  `}
`;
const Container = styled.div`
  border-radius: 1.875rem;
  width: 100%;
  height: 39.19rem;
  display: flex;
  justify-content: space-evenly;

`;
const ComparisonColumn = styled(motion.div)`
  width: 5rem;
  height: 24.1rem;
  margin-top: 12.5rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  ${media.tablet`
    width:2rem;
  `}
`;
const CheckmarkColumn = styled(motion.div)`
  height: 24.1rem;
  width: 5rem;
  margin-top: 12.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  ${media.tablet`
    width: 4rem;
  `}
`;

const ComparisonItem = styled(motion.div)`
  width: 85%;
  height: 3rem;
  font-size: 2rem;
  text-align: center;
  ${media.tablet`
    font-size: 1.5rem;
  `}
`;
const CheckmarkIcon = styled(motion.img)`
  width: 85%;
  height: 3rem;
  pointer-events: none;
  ${media.tablet`
      height: 2rem;
  `}
`;
const SwordIcon = styled.img`
  pointer-events: none;
  height: 5rem;
  width: 5rem;
  position: relative;
  top: 30%;
  right: ${props => props.rightPositioning};
  -webkit-transform: scaleX(${props => props.scaleX});
  transform: scaleX(${props => props.scaleX});
  ${media.tablet`
    height: 3.5rem;
    width: 3.5rem;
  `}
`;

const SenatorInfo = styled(motion.div)`
  background-color: ${props => props.backgroundColor};
  border-radius: 1.75rem;
  width: 17rem;
  height: 34.67rem;
  font-size: 1rem;
  margin-top: 2rem;
  ${media.smallMobile`
    font-size: .9rem;
    height: 32rem;
    width: 7.5rem;
  `}
  ${media.tablet`
    font-size: .9rem;
    height: 32rem;
    width: 12.5rem;
  `}
  ${media.mobile`
    font-size: .9rem;
    height: 32rem;
    width: 9.3rem;
  `}

`;
const SenatorBio = styled(motion.div)`
  height: 30%;
  border-top-left-radius: 1.75rem;
  border-top-right-radius: 1.75rem;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;
const SenatorHeadshot = styled(motion.img)`
  width: 6rem;
  height: 6.8rem;
  object-fit: cover;
  margin-top: 1rem;
  border-radius: 1rem;
  pointer-events: none;
  ${media.tablet`
    width: 4rem;
    height:4.333rem;
  `}
`;
const SenatorHeadshotAndSword = styled(motion.div)`
  display: flex;
`;
const SenatorStatistics = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 70%;
  padding-left: 1rem;
  padding-right: 1rem;
  border-bottom-left-radius: 1.75rem;
  border-bottom-right-radius: 1.75rem;
`;

function ComparisonPage(props) {
  // Data objects
  var [senator1Obj, setSenator1Obj] = useState("");
  var [senator1AvgBillsSponsored, senator1SetAvgBillsSponsored] = useState(-1);
  var [senator1AvgBillsCosponsored, senator1SetAvgBillsCosponsored] = useState(-1);
  var [senator2Obj, setSenator2Obj] = useState("");
  var [senator2AvgBillsSponsored, senator2SetAvgBillsSponsored] = useState(-1);
  var [senator2AvgBillsCosponsored, senator2SetAvgBillsCosponsored] = useState(-1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  // For checkboxes
  var [senator1WinFirst, setSenator1WinFirst] = useState(false);
  var [senator1WinSecond, setSenator1WinSecond] = useState(false);
  var [senator1WinThird, setSenator1WinThird] = useState(false);
  var [senator1WinFourth, setSenator1WinFourth] = useState(false);
  var [senator1WinFifth, setSenator1WinFifth] = useState(false);

  var [senator2WinFirst, setSenator2WinFirst] = useState(false);
  var [senator2WinSecond, setSenator2WinSecond] = useState(false);
  var [senator2WinThird, setSenator2WinThird] = useState(false);
  var [senator2WinFourth, setSenator2WinFourth] = useState(false);
  var [senator2WinFifth, setSenator2WinFifth] = useState(false);

  // Requests
  let pics = JSON.parse(JSON.stringify(PicsJSON));
  var EventEmitter = require("events").EventEmitter;
  var memberObj1 = new EventEmitter;
  var memberObj2 = new EventEmitter;
  var memberID = new EventEmitter;
  const request = require('request');
  function handleWindowSizeChange() {
    setWindowWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    function getSenatorDataByName(name, parsedJson) {
      for (var i = 0; i < parsedJson.results[0].members.length; i++) {
        //console.log(parsedJson.results[0].members[i].first_name.toLowerCase().trim() + parsedJson.results[0].members[i].last_name.toLowerCase().trim());
        if ((parsedJson.results[0].members[i].first_name + " " + parsedJson.results[0].members[i].last_name).toLowerCase().trim() === name.toLowerCase().trim()) {
          return parsedJson.results[0].members[i];
        }
      }
      console.log("There is no match");
      return undefined;
    }
    let optionsForID = {
      url: 'https://api.propublica.org/congress/v1/116/senate/members.json',
      headers: {
        'X-API-Key': 'yoMyvDt0KAspvDWKz8xbfMwNyxMPXfxZw5bPe4Ih'
      },
      json: true
    };
    request(optionsForID, function (err, res, json) {
      if (err) {
        throw new Error(err);
      }
      memberID.data = JSON.stringify(json);
      memberID.emit('updateMemberID');
    }
    );

    memberID.on('updateMemberID', function () {
      var parsedData = JSON.parse(memberID.data);
      //console.log(memberID.data);
      const parsedObj1 = getSenatorDataByName(props.name1, parsedData);
      const parsedObj2 = getSenatorDataByName(props.name2, parsedData);
      setSenator1Obj(parsedObj1);
      setSenator2Obj(parsedObj2);

    })
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
    //console.log(getProfilePic(props.name1));
  }, [])

  function getAverageBillsSponsoredPerTerm(parsedMemberJson) {
    if (parsedMemberJson.results !== undefined) {
      let numberOfTerms = parsedMemberJson.results[0].roles.length;
      let totalBillsSponsored = 0;
      let averageNumberOfBillsSponsoredPerTerm = 0;
      for (let i = 0; i < numberOfTerms; i++) {
        if (parsedMemberJson.results[0].roles[i].bills_sponsored !== undefined) {
          totalBillsSponsored += parsedMemberJson.results[0].roles[i].bills_sponsored;
        }
      }
      averageNumberOfBillsSponsoredPerTerm = totalBillsSponsored / numberOfTerms;
      return averageNumberOfBillsSponsoredPerTerm;
    }
  }

  function getAverageBillsCosponsoredPerTerm(parsedMemberJson) {
    if (parsedMemberJson.results !== undefined) {
      let numberOfTerms = parsedMemberJson.results[0].roles.length;
      let totalBillsCosponsored = 0;
      let averageNumberOfBillsCosponsoredPerTerm = 0;
      for (let i = 0; i < numberOfTerms; i++) {
        if (parsedMemberJson.results[0].roles[i].bills_cosponsored !== undefined) {
          totalBillsCosponsored += parsedMemberJson.results[0].roles[i].bills_cosponsored;
        }
      }
      averageNumberOfBillsCosponsoredPerTerm = totalBillsCosponsored / numberOfTerms;
      return averageNumberOfBillsCosponsoredPerTerm;
    }
  }

  if (senator1Obj !== undefined) {
    let optionsForMember = {
      url: 'https://api.propublica.org/congress/v1/members/' + senator1Obj.id + '.json',
      headers: {
        'X-API-Key': 'yoMyvDt0KAspvDWKz8xbfMwNyxMPXfxZw5bPe4Ih'
      },
      json: true
    };
    request(optionsForMember, function (err, res, json) {
      if (err) {
        throw new Error(err);
      }
      memberObj1.data = JSON.stringify(json);
      memberObj1.emit('updateMemberObj1');
    }
    );
  }

  memberObj1.on('updateMemberObj1', function () {
    var parsedJson = JSON.parse(memberObj1.data);
    if (getAverageBillsSponsoredPerTerm(parsedJson) !== undefined && getAverageBillsCosponsoredPerTerm(parsedJson) !== undefined) {
      let avgSponsoredBills = getAverageBillsSponsoredPerTerm(parsedJson).toFixed(2);
      let avgCosponsoredBills = getAverageBillsCosponsoredPerTerm(parsedJson).toFixed(2);
      senator1SetAvgBillsSponsored(avgSponsoredBills);
      senator1SetAvgBillsCosponsored(avgCosponsoredBills);
    }
  })

  if (senator2Obj !== undefined) {
    let optionsForMember = {
      url: 'https://api.propublica.org/congress/v1/members/' + senator2Obj.id + '.json',
      headers: {
        'X-API-Key': 'yoMyvDt0KAspvDWKz8xbfMwNyxMPXfxZw5bPe4Ih'
      },
      json: true
    };
    request(optionsForMember, function (err, res, json) {
      if (err) {
        throw new Error(err);
      }
      memberObj2.data = JSON.stringify(json);
      memberObj2.emit('updateMemberObj2');
    }
    );
  }

  memberObj2.on('updateMemberObj2', function () {
    var parsedJson = JSON.parse(memberObj2.data);
    if (getAverageBillsSponsoredPerTerm(parsedJson) !== undefined && getAverageBillsCosponsoredPerTerm(parsedJson) !== undefined) {
      let avgSponsoredBills = getAverageBillsSponsoredPerTerm(parsedJson).toFixed(2);
      let avgCosponsoredBills = getAverageBillsCosponsoredPerTerm(parsedJson).toFixed(2);
      senator2SetAvgBillsSponsored(avgSponsoredBills);
      senator2SetAvgBillsCosponsored(avgCosponsoredBills);
    }
  })
  function getProfilePic(props) {
    let firstName = "";
    let lastName = "";
    let modifiedName = props.trim().toLowerCase();
    let names = modifiedName.split(" ");
    firstName = names[0];
    lastName = names[1];
    let numOfSenatorsWithLastName = 0;
    let indexOfSenatorWithLastName = 0;
    if (props !== undefined) {
      for (let i = 0; i < pics.congress.length; i++) {
        //console.log(pics.congress[i].name.toLowerCase().trim() + " includes " + props.toLowerCase().trim() + " ?")
        if ((pics.congress[i].name.toLowerCase().trim()).includes(firstName) && (pics.congress[i].name.toLowerCase().trim()).includes(lastName)) {
          return pics.congress[i].image;
        }
        else if ((pics.congress[i].name.toLowerCase().trim()).includes(lastName)) { // Last name matches, but not first name
          numOfSenatorsWithLastName++;
          indexOfSenatorWithLastName = i;
        }
      }
      if (numOfSenatorsWithLastName === 1) {
        return pics.congress[indexOfSenatorWithLastName].image;
      }
    }
    //console.log(pics.congress[0].image);
  }
  function getRatings(props) {
    let firstName = "";
    let lastName = "";
    let modifiedName = props.trim().toLowerCase();
    let names = modifiedName.split(" ");
    firstName = names[0];
    lastName = names[1];
    let numOfSenatorsWithLastName = 0;
    let indexOfSenatorWithLastName = 0;

    for (let i = 0; i < Ratings.senators.length; i++) {
      if (((Ratings.senators[i].name).trim().toLowerCase()).includes(firstName) && ((Ratings.senators[i].name).trim().toLowerCase()).includes(lastName)) {
        let ratings = [];
        ratings.push(Ratings.senators[i].approval_rating);
        ratings.push(Ratings.senators[i].disapproval_rating);
        return ratings;
      }
      else if (((Ratings.senators[i].name).trim().toLowerCase()).includes(lastName)) {
        numOfSenatorsWithLastName++;
        indexOfSenatorWithLastName = i;
      }
    }
    if (numOfSenatorsWithLastName === 1) {
      let ratings = [];
      ratings.push(Ratings.senators[indexOfSenatorWithLastName].approval_rating);
      ratings.push(Ratings.senators[indexOfSenatorWithLastName].disapproval_rating);
      return ratings;
    }
    return "Ratings not found";
  }

  function compareResults(result) {
    if (result === "sponsored") {
      if (senator1AvgBillsSponsored !== -1 && senator2AvgBillsSponsored !== -1 && senator1AvgBillsSponsored > senator2AvgBillsSponsored) {
        if (!senator1WinFirst) {
          setTimeout(function () {
            senator1Controls.start("senator1Attack");
            senator1ControlsMobile.start("senator1AttackMobile");
          }, 2500);
          setSenator1WinFirst(true);
        }
        return ">"
      }
      else if (senator1AvgBillsSponsored !== -1 && senator2AvgBillsSponsored !== -1 && senator1AvgBillsSponsored < senator2AvgBillsSponsored) {
        if (!senator2WinFirst) {
          //senator2Controls.start("senator2Attack");
          console.log(senator2WinFirst);
          setTimeout(function () {
            senator2Controls.start("senator2Attack");
            senator2ControlsMobile.start("senator2AttackMobile");
          }, 2500);
          setSenator2WinFirst(true);


        }
        return "<";
      }
      else if (senator1AvgBillsSponsored === senator2AvgBillsSponsored) {
        return "=";
      }
    }
    else if (result === "cosponsored") {
      if (senator1AvgBillsCosponsored !== -1 && senator2AvgBillsCosponsored !== -1 && senator1AvgBillsCosponsored > senator2AvgBillsCosponsored) {
        if (!senator1WinSecond) {
          setTimeout(function () {
            senator1Controls.start("senator1Attack");
            senator1ControlsMobile.start("senator1AttackMobile");
          }, 4500);
          setSenator1WinSecond(true);
        }
        return ">"
      }
      else if (senator1AvgBillsCosponsored !== -1 && senator2AvgBillsCosponsored !== -1 && senator1AvgBillsCosponsored < senator2AvgBillsCosponsored) {
        if (!senator2WinSecond) {
          setTimeout(function () {
            senator2Controls.start("senator2Attack");
            senator2ControlsMobile.start("senator2AttackMobile");
          }, 4500);
          setSenator2WinSecond(true);
        }
        return "<";
      }
      else {
        return "=";
      }
    }
    else if (result === "voting_percent") {
      if (senator1Obj.missed_votes_pct > senator2Obj.missed_votes_pct) {
        if (!senator2WinThird) {
          setTimeout(function () {
            senator2Controls.start("senator2Attack");
            senator2ControlsMobile.start("senator2AttackMobile");
          }, 6500);
          setSenator2WinThird(true);
        }

        return ">";
      }
      else if (senator1Obj.missed_votes_pct < senator2Obj.missed_votes_pct) {
        if (!senator1WinThird) {
          setTimeout(function () {
            senator1Controls.start("senator1Attack");
            senator1ControlsMobile.start("senator1AttackMobile");
          }, 6500);
          setSenator1WinThird(true);
        }
        return "<";
      }
      else {
        return "=";
      }
    }
    else if (result === "approval_rating") {
      if (getRatings(props.name1)[0] > getRatings(props.name2)[0]) {
        if (!senator1WinFourth) {
          setTimeout(function () {
            senator1Controls.start("senator1Attack");
            senator1ControlsMobile.start("senator1AttackMobile");
          }, 8500);
          setSenator1WinFourth(true);
        }
        return ">";
      }
      else if (getRatings(props.name1)[0] < getRatings(props.name2)[0]) {
        if (!senator2WinFourth) {
          setTimeout(function () {
            senator2Controls.start("senator2Attack");
            senator2ControlsMobile.start("senator2AttackMobile");
          }, 8500);
          setSenator2WinFourth(true)
        }
        return "<";
      }
      else {
        return "=";
      }
    }
    else if (result === "disapproval_rating") {
      if (getRatings(props.name1)[1] > getRatings(props.name2)[1]) {
        if (!senator2WinFifth) {
          setSenator2WinFifth(true);
          setTimeout(function () {
            senator2Controls.start("senator2Attack");
            senator2ControlsMobile.start("senator2AttackMobile");
          }, 10500);
        }
        return ">";
      }
      else if (getRatings(props.name1)[1] < getRatings(props.name2)[1]) {
        if (!senator1WinFifth) {
          setTimeout(function () {
            senator1Controls.start("senator1Attack");
            senator1ControlsMobile.start("senator1AttackMobile");
          }, 10500);
          setSenator1WinFifth(true);
        }
        return "<";
      }
      else {
        return "=";
      }
    }
    else {
      return "input not correct";
    }
  }
  function getCheckmarkDisplay(columnNum) {
    if (windowWidth >= 550 && columnNum === 1) {
      return(
        <CheckmarkColumn>
          <CheckmarkIcon src={Checkmark} initial={{ opacity: 0 }} animate={senator1WinFirst ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 2 }} />
          <CheckmarkIcon src={Checkmark} initial={{ opacity: 0 }} animate={senator1WinSecond ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 4 }} />
          <CheckmarkIcon src={Checkmark} initial={{ opacity: 0 }} animate={senator1WinThird ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 6 }} />
          <CheckmarkIcon src={Checkmark} initial={{ opacity: 0 }} animate={senator1WinFourth ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 8 }} />
          <CheckmarkIcon src={Checkmark} initial={{ opacity: 0 }} animate={senator1WinFifth ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 10 }} />
        </CheckmarkColumn>
      );
    }
    else if(windowWidth >= 550 && columnNum === 2){
      return(
        <CheckmarkColumn>
          <CheckmarkIcon src={Checkmark} initial={{ opacity: 0 }} animate={senator2WinFirst ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 2 }} />
          <CheckmarkIcon src={Checkmark} initial={{ opacity: 0 }} animate={senator2WinSecond ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 4 }} />
          <CheckmarkIcon src={Checkmark} initial={{ opacity: 0 }} animate={senator2WinThird ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 6 }} />
          <CheckmarkIcon src={Checkmark} initial={{ opacity: 0 }} animate={senator2WinFourth ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 8 }} />
          <CheckmarkIcon src={Checkmark} initial={{ opacity: 0 }} animate={senator2WinFifth ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 10 }} />
        </CheckmarkColumn>
      );
    }
    else {
      return (
        null
      );
    }
  }
  function getAnimationControl() {
    if (windowWidth >= 750) {
      return [senator1Controls, senator2Controls];
    }
    else {
      return [senator1ControlsMobile, senator2ControlsMobile];
    }
  }
  const variants = {
    senator1Attack: { x: [35, 400, 35], y: [0, -50, -10, -50, 0], transition: { duration: 1.2 } },
    senator2Attack: { x: [35, -350, 35], y: [0, -50, -10, -50, 0], transition: { duration: 1.2 } },
    senator1AttackMobile: { x: [35, 160, 35], y: [0, -50, -10, -50, 0], transition: { duration: 1.2 } },
    senator2AttackMobile: { x: [35, -110, 35], y: [0, -50, -10, -50, 0], transition: { duration: 1.2 } }
  }
  const senator1Controls = useAnimation();
  const senator2Controls = useAnimation();

  const senator1ControlsMobile = useAnimation();
  const senator2ControlsMobile = useAnimation();
  return (
    <div>
      <Container>
        {getCheckmarkDisplay(1)}
        <SenatorInfo backgroundColor={props.darkMode ? "#3b3a3a" : "#DEDCDC"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .75 }}>
          <SenatorBio>
            <SenatorHeadshotAndSword initial={{ x: 35 }} variants={variants} animate={getAnimationControl()[0]}>
              <SenatorHeadshot src={"" + getProfilePic(props.name1)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}></SenatorHeadshot>
              <SwordIcon src={Sword} scaleX="1" rightPositioning="20%"></SwordIcon>
            </SenatorHeadshotAndSword>
            <Subtitle initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}> Senator {senator1Obj.first_name + " " + senator1Obj.last_name} </Subtitle>
          </SenatorBio>
          <SenatorStatistics>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>Bills Sponsored Per Term: {senator1AvgBillsSponsored} </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>Bills Co-Sponsored Per Term: {senator1AvgBillsCosponsored} </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6 }}>% Votes Missed: {senator1Obj.missed_votes_pct}%</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}>Approval Rating: {getRatings(props.name1)[0]}</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.4 }}>Disapproval Rating: {getRatings(props.name1)[1]}</motion.p>
          </SenatorStatistics>
        </SenatorInfo>
        <ComparisonColumn>
          <ComparisonItem>{compareResults("sponsored")}</ComparisonItem>
          <ComparisonItem>{compareResults("cosponsored")}</ComparisonItem>
          <ComparisonItem>{compareResults("voting_percent")}</ComparisonItem>
          <ComparisonItem>{compareResults("approval_rating")}</ComparisonItem>
          <ComparisonItem>{compareResults("disapproval_rating")}</ComparisonItem>
        </ComparisonColumn>
        <SenatorInfo backgroundColor={props.darkMode ? "#3b3a3a" : "#DEDCDC"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .75 }}>
          <SenatorBio>
            <SenatorHeadshotAndSword initial={{ x: 35 }} variants={variants} animate={getAnimationControl()[1]}>
              <SenatorHeadshot src={"" + getProfilePic(props.name2)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}></SenatorHeadshot>
              <SwordIcon src={Sword} scaleX="-1" rightPositioning="80%"></SwordIcon>
            </SenatorHeadshotAndSword>
            <Subtitle initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}> Senator  {senator2Obj.first_name + " " + senator2Obj.last_name} </Subtitle>
          </SenatorBio>
          <SenatorStatistics>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>Bills Sponsored Per Year: {senator2AvgBillsSponsored}</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>Bills Co-Sponsored Per Year: {senator2AvgBillsCosponsored}</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6 }}>% Votes Missed: {senator2Obj.missed_votes_pct}%</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}>Approval Rating: {getRatings(props.name2)[0]}</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.4 }}>Disapproval Rating: {getRatings(props.name2)[1]} </motion.p>
          </SenatorStatistics>
        </SenatorInfo>
        {getCheckmarkDisplay(2)}
      </Container>
    </div>
  );
}
export default ComparisonPage;
