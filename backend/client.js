//npm i node-fetch && node --experimental-json-modules  ./client.js 
import protobuf from './protobuf/protobuf.js'
import fetch from 'node-fetch';

function jsFetch(postBuffer, resMessage) {
  fetch("http://127.0.0.1:3000", {
      method: 'POST',
      headers: {
        "Content-Type": "application/octet-stream"
      },
      body: postBuffer
    }).then(res => res.arrayBuffer())
    .catch(error => console.log('Error:', error))
    .then(response => { 
          {
            //WorkerResponse
      　　　 console.log('response',response)
            const msg = resMessage.decode(new Uint8Array(response))
            const resObj = resMessage.toObject(msg)
            console.log('resObj', resObj)
            console.log('resObj', JSON.stringify( resObj))
          }  
    }, err => {
      console.log('err', err)
    })
}

function testworkerRequest() {
  const message4 = protobuf.CommonRequest.create({workerRequest: 
    {
      page: 1, 
      pageSize: 5, 
      filterRuning: false, 
      filterStakeEnough: false, 
      filterCommissionLessThen: true, 
      sortFieldName: 'commission',
      filterStashAccounts: []}});
  console.log(`message = ${JSON.stringify(message4)}`);
  const buffer4 = protobuf.CommonRequest.encode(message4).finish();
  jsFetch(buffer4, protobuf.WorkerResponse);
}

function testglobalStatisticsRequest() {
  const message = protobuf.CommonRequest.create({globalStatisticsRequest: {}});
  console.log(`message = ${JSON.stringify(message)}`);
  const buffer = protobuf.CommonRequest.encode(message).finish();
  console.log(buffer);
  jsFetch(buffer, protobuf.GlobalStatisticsResponse);
  
}

function teststake() {
  const message2 = protobuf.CommonRequest.create({avgStakeRequest: {}});
  console.log(`message = ${JSON.stringify(message2)}`);
  const buffer2 = protobuf.CommonRequest.encode(message2).finish();
  console.log(buffer2);
  jsFetch(buffer2, protobuf.AvgStakeResponse);

  const message3 = protobuf.CommonRequest.create({stakeInfoRequest: {stashAccount: "41rqEQk9YWqVt3RHAyDquCauZJyatUDEDDtMTcNfvYP1MTB6"}});
  console.log(`message = ${JSON.stringify(message3)}`);
  const buffer3 = protobuf.CommonRequest.encode(message3).finish();
  jsFetch(buffer3, protobuf.StakeInfoResponse);
}

function testreward() {
  const message5 = protobuf.CommonRequest.create({avgRewardRequest: {}});
  console.log(`message = ${JSON.stringify(message5)}`);
  const buffer5 = protobuf.CommonRequest.encode(message5).finish();
  jsFetch(buffer5, protobuf.AvgRewardResponse);

  const message6 = protobuf.CommonRequest.create({rewardPenaltyRequest: {stashAccount: "42SrMJERV2P2aDcLbDdUdRNaPGzQZU8hNUuJDgMitUGqFp5q"}});
  console.log(`message = ${JSON.stringify(message6)}`);
  const buffer6 = protobuf.CommonRequest.encode(message6).finish();
  jsFetch(buffer6, protobuf.RewardPenaltyResponse);
}


function testapy() {
  const message6 = protobuf.CommonRequest.create({apyRequest: {stashAccount: "42SrMJERV2P2aDcLbDdUdRNaPGzQZU8hNUuJDgMitUGqFp5q"}});
  console.log(`message = ${JSON.stringify(message6)}`);
  const buffer6 = protobuf.CommonRequest.encode(message6).finish();
  jsFetch(buffer6, protobuf.ApyResponse);
}

function testcommission() {
  const message6 = protobuf.CommonRequest.create({commissionRequest: {stashAccount: "42SrMJERV2P2aDcLbDdUdRNaPGzQZU8hNUuJDgMitUGqFp5q"}});
  console.log(`message = ${JSON.stringify(message6)}`);
  const buffer6 = protobuf.CommonRequest.encode(message6).finish();
  jsFetch(buffer6, protobuf.CommissionResponse);
}

function testunknow() {
  const message6 = protobuf.CommonRequest.create({unknowRequest: {stashAccount: "42SrMJERV2P2aDcLbDdUdRNaPGzQZU8hNUuJDgMitUGqFp5q"}});
  console.log(`message = ${JSON.stringify(message6)}`);
  const buffer6 = protobuf.CommonRequest.encode(message6).finish();
  jsFetch(buffer6, protobuf.CommonResponse);
}

// testworkerRequest()

// testglobalStatisticsRequest()

// teststake()

// testreward()

// testapy()

testcommission()


// testunknow()