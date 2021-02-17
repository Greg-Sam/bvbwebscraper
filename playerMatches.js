const axios = require('axios');
const { all } = require('./routes/beachRoutes');
const router = require('express').Router();

let tournamentArray = []

const loadTournament = (s) => {
  axios.get(`http://localhost:3000/api/rawtournaments/season/${s}`)
    .then(({ data }) => {
      for (let tournament of data) {
        // console.log(tournament.raw)
        tournamentArray.push(tournament)
        matchGenerator(tournament.raw, tournament.id)
      }
    })
}

let season = 2019
for (let s = season; s >= 2019; s--) {
  loadTournament(s)
}

const matchGenerator = (tourneyData, id) => {

  tourneyData.replace(/, Q/g, '')
  let everyMatch = []
  let matchArray = []
  let tournamentParts = []

  while (tourneyData.indexOf(') ') > 30) {
    // console.log(tourneyData)
    let start = tourneyData.indexOf('Header">')
    let check = tourneyData.slice(start + 8)
    // console.log(check)
    end = null
    if (check.indexOf('Header">') !== -1) {
      end = check.indexOf('Header">')
    } else {
      end = check.indexOf('</td>')
    }
    // console.log(end)
    let part = check.slice(0, end)
    // console.log(`new part ----------------------------------------- ${part}`)
    tournamentParts.push(part)
    tourneyData = check.slice(end - 37)
  }
  // console.log(tournamentParts)
  const getFinals = (round, roundNum, superRound) => {
    let matches = {
      superRound: superRound,
      subRound: roundNum,
      matchString: ''
    }
    if (superRound === 'Semifinals') {
      getMatches(round, roundNum, superRound)
    } else {
      matches.matchString = round
      matchArray.push(matches)
    }
  }

  const getMatches = (round, roundNum, superRound) => {
    // console.log(round)
    // matchArray.push(matches)
    let match = round.split('Match')
    match.forEach(element => {
      let matches = {
        superRound: superRound,
        subRound: roundNum,
        matchString: ''
      }
      if (element.indexOf('href') !== -1) {
        matches.matchString = element
        matchArray.push(matches)
      }
    });
  }

  const getRounds = (part) => {

    // console.log(part)
    if (part.indexOf('Round 1') === -1) {
      if (part.indexOf('Country Q') !== -1) {
        let end = part.indexOf('</div>')
        superRound = part.slice(0, end)
        getMatches(part, '', superRound)
      } else {
        let start = part.indexOf(`Header">`)
        let end = part.indexOf(`</div>`)
        let superRound = part.slice(start + 1, end)
        getFinals(part, '', superRound)
      }
    } else {
      if (part.indexOf('Round 3') === -1) {
        let end = part.indexOf('</div>')
        superRound = part.slice(0, end)
        let round1Start = part.indexOf('Round 1')
        let round1End = part.indexOf('</p><p>')
        let round1 = part.slice(round1Start, round1End)
        let roundNum = '9th Place Match'
        getMatches(round1, roundNum, superRound)
        let round2Start = part.indexOf('Round 2')
        let round2 = part.slice(round2Start)
        roundNum = '5th Place Match'
        getMatches(round2, roundNum, superRound)
      } else {
        let end = part.indexOf('</div>')
        superRound = part.slice(0, end)
        let round1Start = part.indexOf('Round 1')
        let round1End = part.indexOf('</p><p>')
        let round1 = part.slice(round1Start, round1End)
        let shorterSuperRound = part.slice(round1End +3)
        let roundNum = '17th Place Match'
        // console.log(round1, '---------------------------------', roundNum)
        getMatches(round1, roundNum, superRound)
        // console.log(shorterSuperRound)
        let round2Start = shorterSuperRound.indexOf('Round 2')
        let round2End = shorterSuperRound.indexOf('</p><p>')
        let round2 = shorterSuperRound.slice(round2Start, round2End)
        shorterSuperRound = shorterSuperRound.slice(round2End)
        roundNum = '9th Place Match'
        // console.log(round2, '---------------------------------', roundNum)

        getMatches(round2, roundNum, superRound)
        let round3Start = shorterSuperRound.indexOf('Round 3')
        let round3 = shorterSuperRound.slice(round3Start)
        roundNum = '5th Place Match'
        // console.log(round3, '---------------------------------', roundNum)
        getMatches(round3, roundNum, superRound)
      }
    }
  }

  tournamentParts.map(part => getRounds(part)
  )

  // console.log(matchArray)

  const getMatchDetails = (match) => {
    // console.log(match.matchString)
    let matchInfo = {
      tournamentId: '',
      superRound: '',
      subRound: '',
      playerAName: '',
      playerAId: '',
      playerBName: '',
      playerBId: '',
      playerCName: '',
      playerCId: '',
      playerDName: '',
      playerDId: '',
      playerANationality: '',
      playerBNationality: '',
      playerCNationality: '',
      playerDNationality: '',
      matchScore: '',
      matchLength: '',
      playerAResult: 'Win',
      playerBResult: 'Win',
      playerCResult: 'Loss',
      playerDResult: 'Loss'
    }
    if (match.superRound === 'Gold Medal') {
      match.superRound = 'Gold Medal Match'
    }
    if (match.superRound === 'Bronze Medal') {
      match.superRound = 'Bronze Medal Match'
    }
    if (match.superRound === 'Country Quota Matches') {
      match.superRound = 'Country Quota'
    }
    if (match.superRound === 'Country Quota' && match.subRound === '5th Place Match') {
      match.subRound = '2nd Round'
    }
    if (match.superRound === 'Country Quota' && match.subRound === '9th Place Match') {
      match.subRound = '1st Round'
    }
    if (match.superRound === 'Qualifier Bracket' && match.subRound === '9th Place Match') {
      match.superRound = 'Qualification'
      match.subRound = '1st Round'
    }
    if (match.superRound === 'Qualifier Bracket' && match.subRound === '5th Place Match') {
      match.superRound = 'Qualification'
      match.subRound = '2nd Round'
    }
    if (match.superRound.indexOf('Pool') !== -1 && match.subRound === '9th Place Match') {
      match.superRound = 'Pool Play'
      match.subRound = '1st Round'
    }
    if (match.superRound.indexOf('Pool') !== -1 && match.subRound === '5th Place Match') {
      match.superRound = 'Pool Play'
      match.subRound = '2nd Round'
    }
    if (match.superRound === `Winner's Bracket`) {
      match.superRound = ''
    }
    match.matchString = match.matchString.replace(/\n/g, '')
    matchInfo.superRound = match.superRound
    matchInfo.subRound = match.subRound
    let shorterMatchString = match.matchString.slice(match.matchString.indexOf('ID=') + 3)
    matchInfo.playerAId = shorterMatchString.slice(0, shorterMatchString.indexOf('">'))
    matchInfo.playerAName = shorterMatchString.slice(shorterMatchString.indexOf('">') + 2, shorterMatchString.indexOf('</a>'))
    shorterMatchString = shorterMatchString.slice(shorterMatchString.indexOf('ID=') + 3)
    matchInfo.playerBId = shorterMatchString.slice(0, shorterMatchString.indexOf('">'))
    matchInfo.playerBName = shorterMatchString.slice(shorterMatchString.indexOf('">') + 2, shorterMatchString.indexOf('</a>'))
    matchInfo.playerBNationality = shorterMatchString.slice(shorterMatchString.indexOf('</a>') + 5, shorterMatchString.indexOf(' ('))
    if (matchInfo.superRound === 'Country Quota') { matchInfo.playerBNationality = shorterMatchString.slice(shorterMatchString.indexOf('</a>') + 5, shorterMatchString.indexOf('</b>')) }
    matchInfo.playerANationality = matchInfo.playerBNationality
    shorterMatchString = shorterMatchString.slice(shorterMatchString.indexOf('ID=') + 3)
    matchInfo.playerCId = shorterMatchString.slice(0, shorterMatchString.indexOf('">'))
    matchInfo.playerCName = shorterMatchString.slice(shorterMatchString.indexOf('">') + 2, shorterMatchString.indexOf('</a>'))
    shorterMatchString = shorterMatchString.slice(shorterMatchString.indexOf('ID=') + 3)
    matchInfo.playerDId = shorterMatchString.slice(0, shorterMatchString.indexOf('">'))
    matchInfo.playerDName = shorterMatchString.slice(shorterMatchString.indexOf('">') + 2, shorterMatchString.indexOf('</a>'))
    matchInfo.playerCNationality = shorterMatchString.slice(shorterMatchString.indexOf('</a>') + 5, shorterMatchString.indexOf(' ('))
    if (matchInfo.superRound === 'Country Quota') {
      matchInfo.playerCNationality = matchInfo.playerBNationality
    }
    matchInfo.playerDNationality = matchInfo.playerCNationality
    shorterMatchString = shorterMatchString.slice(shorterMatchString.indexOf(') ') + 2)
    matchInfo.matchScore = shorterMatchString.slice(0, shorterMatchString.indexOf('(') - 1)
    matchInfo.matchLength = shorterMatchString.slice(shorterMatchString.indexOf('(') + 1, shorterMatchString.indexOf(')'))
    // console.log(shorterMatchString)
    // console.log(matchInfo.matchLength)
    everyMatch.push(matchInfo)
  }
  // console.log(matchArray)
  matchArray.map(match => getMatchDetails(match))

  playerMatchPrep(everyMatch, id)
}

const playerMatchPrep = (matchGenerator, id) => {
  let getRelevant = tournamentArray.filter(tournament => {
    // console.log(matchGenerator)
    return tournament.id === id
  })
  // console.log(getRelevant[0].name)
  matchGenerator.forEach(match => {
    // console.log(match)

    let playerA = {
      name: match.playerAName,
      playerId: match.playerAId,
      matches: {
        tournament: getRelevant[0].name,
        tournamentId: id,
        season: getRelevant[0].season,
        round: `${match.superRound} ${match.subRound}`,
        partner: match.playerBName,
        partnerId: match.playerBId,
        opponents: {
          opponentA: match.playerCName,
          opponentAId: match.playerCId,
          opponentB: match.playerDName,
          opponentBId: match.playerDId,
          opponentNationality: match.playerCNationality,
          opponentNationalityCode: ''
        },
        result: 'Win',
        score: match.matchScore,
        matchLength: match.matchLength
      }
    }

    let playerB = {
      name: match.playerBName,
      playerId: match.playerBId,
      matches: {
        tournament: getRelevant[0].name,
        tournamentId: id,
        season: getRelevant[0].season,
        round: `${match.superRound} ${match.subRound}`,
        partner: match.playerAName,
        partnerId: match.playerAId,
        opponents: {
          opponentA: match.playerCName,
          opponentAId: match.playerCId,
          opponentB: match.playerDName,
          opponentBId: match.playerDId,
          opponentNationality: match.playerCNationality,
          opponentNationalityCode: ''
        },
        result: 'Win',
        score: match.matchScore,
        matchLength: match.matchLength
      }
    }

    let playerC = {
      name: match.playerCName,
      playerId: match.playerCId,
      matches: {
        tournament: getRelevant[0].name,
        tournamentId: id,
        season: getRelevant[0].season,
        round: `${match.superRound} ${match.subRound}`,
        partner: match.playerDName,
        partnerId: match.playerDId,
        opponents: {
          opponentA: match.playerAName,
          opponentAId: match.playerAId,
          opponentB: match.playerBName,
          opponentBId: match.playerBId,
          opponentNationality: match.playerANationality,
          opponentNationalityCode: ''
        },
        result: 'Loss',
        score: match.matchScore,
        matchLength: match.matchLength
      }
    }

    let playerD = {
      name: match.playerDName,
      playerId: match.playerDId,
      matches: {
        tournament: getRelevant[0].name,
        tournamentId: id,
        season: getRelevant[0].season,
        round: `${match.superRound} ${match.subRound}`,
        partner: match.playerCName,
        partnerId: match.playerCId,
        opponents: {
          opponentA: match.playerAName,
          opponentAId: match.playerAId,
          opponentB: match.playerBName,
          opponentBId: match.playerBId,
          opponentNationality: match.playerANationality,
          opponentNationalityCode: ''
        },
        result: 'Loss',
        score: match.matchScore,
        matchLength: match.matchLength
      }
    }
    // console.log(playerA)
    axios.put(`http://localhost:3000/api/player/matchpush`, playerA)
      .then(console.log(`${playerA.name} matches updated`))

    axios.put(`http://localhost:3000/api/player/matchpush`, playerB)
      .then(console.log(`${playerB.name} matches updated`))

    axios.put(`http://localhost:3000/api/player/matchpush`, playerC)
      .then(console.log(`${playerC.name} matches updated`))

    axios.put(`http://localhost:3000/api/player/matchpush`, playerD)
      .then(console.log(`${playerD.name} matches updated`))
  })
}