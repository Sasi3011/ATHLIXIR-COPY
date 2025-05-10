import axios from "axios"

// TheSportsDB API - Free and doesn't require authentication
const SPORTS_DB_API = 'https://www.thesportsdb.com/api/v1/json/3';

// Create axios instance for TheSportsDB API
const sportsDbAxios = axios.create({
  baseURL: SPORTS_DB_API,
  timeout: 10000 // 10 seconds timeout
});

// Fetch timeout to prevent long-running requests
const FETCH_TIMEOUT = 5000; // 5 seconds

// Sports image URLs for fallback - organized by category
const SPORTS_IMAGES = {
  default: [
    'https://media.istockphoto.com/id/1320104839/photo/soccer-player-kicks-a-ball.jpg?s=612x612&w=0&k=20&c=IM_0hDhK4zyxrJP4oMNxIQlGLN09TKYuKJ_Jh9DMkZE=',
    'https://media.istockphoto.com/id/1366428092/photo/basketball-ball-on-wooden-parquet-close-up-in-gym.jpg?s=612x612&w=0&k=20&c=Dk9ST0x-j9_Vc9aCGcIYVJm7UjLIYa8ks4JRfZx_9_k=',
    'https://media.istockphoto.com/id/1443345273/photo/cricket-leather-ball-resting-on-bat-on-the-stadium-pitch.jpg?s=612x612&w=0&k=20&c=Fz2jPiNJ2jbF-Dv5-M_2vWsLAGkEYe-doFwfBOOsWtY='
  ],
  football: [
    'https://media.istockphoto.com/id/1320104839/photo/soccer-player-kicks-a-ball.jpg?s=612x612&w=0&k=20&c=IM_0hDhK4zyxrJP4oMNxIQlGLN09TKYuKJ_Jh9DMkZE=',
    'https://media.istockphoto.com/id/1308674342/photo/american-football-player-in-dark-on-stadium.jpg?s=612x612&w=0&k=20&c=TnmCxM5YP1TpnGRVZdLGz0Ot6y7G_DPD6Lm-O4UJTxQ=',
    'https://media.istockphoto.com/id/1368231566/photo/american-football-player-in-action-on-stadium.jpg?s=612x612&w=0&k=20&c=YKCvHG6GI9fOx5IlYFpp5Hh9XrHAGKq1Oi_Uo2jQzQs='
  ],
  basketball: [
    'https://media.istockphoto.com/id/1366428092/photo/basketball-ball-on-wooden-parquet-close-up-in-gym.jpg?s=612x612&w=0&k=20&c=Dk9ST0x-j9_Vc9aCGcIYVJm7UjLIYa8ks4JRfZx_9_k=',
    'https://media.istockphoto.com/id/1309219758/photo/basketball-player-makes-slam-dunk.jpg?s=612x612&w=0&k=20&c=lXkbWzXJGjtkTVwNlA_FEH_dFqQKs7FXGPjrn-KzFHQ=',
    'https://media.istockphoto.com/id/1190871262/photo/basketball-player-makes-layup.jpg?s=612x612&w=0&k=20&c=RVVX8ZlWZBX6Aw9fVXrYcBZQUQKFgZQgQwNp0KqJ8Qw='
  ],
  cricket: [
    'https://media.istockphoto.com/id/1443345273/photo/cricket-leather-ball-resting-on-bat-on-the-stadium-pitch.jpg?s=612x612&w=0&k=20&c=Fz2jPiNJ2jbF-Dv5-M_2vWsLAGkEYe-doFwfBOOsWtY=',
    'https://media.istockphoto.com/id/519665478/photo/cricket-batsman-hitting-ball-during-cricket-match-in-stadium.jpg?s=612x612&w=0&k=20&c=Ckw-cYZPTnQYMBBQaZdJlVGC8UvZLQoJ_D83iUFvhgw=',
    'https://media.istockphoto.com/id/1295274245/photo/cricket-leather-ball-resting-on-bat-on-the-stadium-pitch.jpg?s=612x612&w=0&k=20&c=Z5MzX7qjDoXHCB0o8zKBENpllPvWwP0aKfBcK7rDYeE='
  ],
  hockey: [
    'https://media.istockphoto.com/id/1170712010/photo/close-up-of-hockey-stick-and-puck-on-ice.jpg?s=612x612&w=0&k=20&c=EBjCyYWphLptgGAdnYwI-R8nYKIQVQUCvKQvYmjCVe4=',
    'https://media.istockphoto.com/id/1190275348/photo/ice-hockey-players-in-action.jpg?s=612x612&w=0&k=20&c=Ib_NJXqUxBhHHmlfHuJeNzQEXRNiWUwwu2qX_YGb9ck=',
    'https://media.istockphoto.com/id/1297856272/photo/field-hockey-players-in-action.jpg?s=612x612&w=0&k=20&c=Jxe4Lx-4QNJ-XEV_z_0-wJmQT4mV7Qs8ZDdJC4_BNCY='
  ],
  kabaddi: [
    'https://media.istockphoto.com/id/1369257635/photo/kabaddi-player-in-action.jpg?s=612x612&w=0&k=20&c=cYGHVZRYODQwWB_L7iW-CFwwAY8LrWJdYWsI7-hQGwg=',
    'https://media.istockphoto.com/id/1369257634/photo/kabaddi-player-in-action.jpg?s=612x612&w=0&k=20&c=6FbQmkKGf-1RCxdCEIEYqQBP-K0JQvKJcEJ_WRmyZwA=',
    'https://media.istockphoto.com/id/1369257636/photo/kabaddi-player-in-action.jpg?s=612x612&w=0&k=20&c=6ZrYJKkGS-E9pxYOTQ5dDC6jtUQvQDDRGSLwi9Jj_Gg='
  ],
  'kho - kho': [
    'https://media.istockphoto.com/id/1369257635/photo/kabaddi-player-in-action.jpg?s=612x612&w=0&k=20&c=cYGHVZRYODQwWB_L7iW-CFwwAY8LrWJdYWsI7-hQGwg=',
    'https://media.istockphoto.com/id/1369257634/photo/kabaddi-player-in-action.jpg?s=612x612&w=0&k=20&c=6FbQmkKGf-1RCxdCEIEYqQBP-K0JQvKJcEJ_WRmyZwA=',
    'https://media.istockphoto.com/id/1369257636/photo/kabaddi-player-in-action.jpg?s=612x612&w=0&k=20&c=6ZrYJKkGS-E9pxYOTQ5dDC6jtUQvQDDRGSLwi9Jj_Gg='
  ]
};

// Get a random sports image for fallback based on category
const getRandomSportsImage = (category = null) => {
  // Convert category to lowercase for matching
  const categoryLower = category ? category.toLowerCase() : null;
  
  // Get the appropriate image array based on category
  const imageArray = categoryLower && SPORTS_IMAGES[categoryLower] ? 
    SPORTS_IMAGES[categoryLower] : SPORTS_IMAGES.default;
  
  // Get a random image from the array
  const randomIndex = Math.floor(Math.random() * imageArray.length);
  return imageArray[randomIndex];
};

// Map categories to search terms
const CATEGORY_SEARCH_TERMS = {
  all: 'sports',
  football: 'football OR NFL',
  basketball: 'basketball OR NBA',
  cricket: 'cricket',
  tennis: 'tennis',
  golf: 'golf',
  hockey: 'hockey OR NHL',
  'kho - kho': 'kho kho',
  kabaddi: 'kabaddi'
};

// Get search term for category
const getCategorySearchTerm = (category) => {
  const lowerCategory = category.toLowerCase();
  return CATEGORY_SEARCH_TERMS[lowerCategory] || CATEGORY_SEARCH_TERMS.all;
};

// Get all sports news
export const getAllSportsNews = async (page = 1, pageSize = 10) => {
  // Comment out API fetching and return default news directly
  /*
  try {
    // Use TheSportsDB API to get sports news (free, no auth required)
    const response = await sportsDbAxios.get('/all_sports.php');
    
    if (response.data && response.data.sports && response.data.sports.length > 0) {
      // Get sports details and transform to news articles
      const sportsData = response.data.sports;
      
      // Create news articles from sports data
      const articles = sportsData.slice(0, pageSize).map(sport => {
        // Create a news article for each sport
        return {
          title: `${sport.strSport} News and Updates`,
          description: sport.strSportDescription || `Latest news and updates about ${sport.strSport}`,
          urlToImage: sport.strSportThumb || getRandomSportsImage(sport.strSport.toLowerCase()),
          source: { name: 'TheSportsDB' },
          publishedAt: new Date().toISOString(),
          content: sport.strSportDescription,
          url: '#',
          category: sport.strSport.toLowerCase(),
          isToday: true,
          isRecent: true
        };
      });
      
      return {
        articles: articles,
        totalArticles: sportsData.length
      };
    } else {
      // Try getting events as news
      return await getSportsEvents(page, pageSize);
    }
  } catch (error) {
    console.error("Error fetching sports data:", error);
    // Try getting events as news
    return await getSportsEvents(page, pageSize);
  }
  */
  
  // Return default news with today's date
  return getFallbackNewsData();
}

// Get sports events as news
const getSportsEvents = async (page = 1, pageSize = 10) => {
  try {
    // Use TheSportsDB API to get upcoming events (free, no auth required)
    const response = await sportsDbAxios.get('/eventsday.php', {
      params: {
        d: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        s: 'Soccer' // Default sport
      }
    });
    
    if (response.data && response.data.events && response.data.events.length > 0) {
      // Create news articles from events data
      const articles = response.data.events.slice(0, pageSize).map(event => {
        const sportCategory = event.strSport ? event.strSport.toLowerCase() : 'sports';
        
        return {
          title: `${event.strEvent} - Upcoming Match`,
          description: `${event.strHomeTeam} vs ${event.strAwayTeam} - ${event.dateEvent} ${event.strTime}`,
          urlToImage: event.strThumb || getRandomSportsImage(sportCategory),
          source: { name: event.strLeague || 'Sports League' },
          publishedAt: new Date().toISOString(),
          content: `Upcoming match between ${event.strHomeTeam} and ${event.strAwayTeam} at ${event.strVenue}. Date: ${event.dateEvent}, Time: ${event.strTime}.`,
          url: '#',
          category: sportCategory,
          isToday: true,
          isRecent: true
        };
      });
      
      return {
        articles: articles,
        totalArticles: response.data.events.length
      };
    } else {
      // Try getting teams as news
      return await getSportsTeams(page, pageSize);
    }
  } catch (error) {
    console.error("Error fetching sports events:", error);
    // Try getting teams as news
    return await getSportsTeams(page, pageSize);
  }
}

// Get sports teams as news
const getSportsTeams = async (page = 1, pageSize = 10) => {
  try {
    // Use TheSportsDB API to get teams (free, no auth required)
    const response = await sportsDbAxios.get('/search_all_teams.php', {
      params: {
        l: 'English Premier League' // Default league
      }
    });
    
    if (response.data && response.data.teams && response.data.teams.length > 0) {
      // Create news articles from teams data
      const articles = response.data.teams.slice(0, pageSize).map(team => {
        const sportCategory = team.strSport ? team.strSport.toLowerCase() : 'football';
        
        return {
          title: `${team.strTeam} - Team Profile`,
          description: team.strDescriptionEN ? team.strDescriptionEN.substring(0, 200) + '...' : `Latest news about ${team.strTeam}`,
          urlToImage: team.strTeamBadge || team.strTeamJersey || team.strTeamLogo || getRandomSportsImage(sportCategory),
          source: { name: team.strLeague || 'Sports League' },
          publishedAt: new Date().toISOString(),
          content: team.strDescriptionEN || `${team.strTeam} is a professional sports team based in ${team.strCountry}.`,
          url: '#',
          category: sportCategory,
          isToday: true,
          isRecent: true
        };
      });
      
      return {
        articles: articles,
        totalArticles: response.data.teams.length
      };
    } else {
      // Use fallback data
      return getFallbackNewsData();
    }
  } catch (error) {
    console.error("Error fetching sports teams:", error);
    // Use fallback data
    return getFallbackNewsData();
  }
}

// Get news by category
export const getNewsByCategory = async (category, page = 1, pageSize = 10) => {
  // Comment out API fetching and return filtered default news
  /*
  try {
    // Convert category to a format TheSportsDB can use
    const sportName = CATEGORY_SEARCH_MAP[category.toLowerCase()] || category;
    
    // Use TheSportsDB API to get teams for this sport
    const response = await sportsDbAxios.get('/search_all_teams.php', {
      params: {
        s: sportName // Search by sport name
      }
    });
    
    if (response.data && response.data.teams && response.data.teams.length > 0) {
      // Create news articles from teams data
      const articles = response.data.teams.slice(0, pageSize).map(team => {
        return {
          title: `${team.strTeam} - ${sportName} Team Profile`,
          description: team.strDescriptionEN ? team.strDescriptionEN.substring(0, 200) + '...' : `Latest news about ${team.strTeam}`,
          urlToImage: team.strTeamBadge || team.strTeamJersey || team.strTeamLogo || getRandomSportsImage(category.toLowerCase()),
          source: { name: team.strLeague || 'Sports League' },
          publishedAt: new Date().toISOString(),
          content: team.strDescriptionEN || `${team.strTeam} is a professional ${sportName} team based in ${team.strCountry}.`,
          url: '#',
          category: category.toLowerCase(),
          isToday: true,
          isRecent: true
        };
      });
      
      return {
        articles: articles,
        totalArticles: response.data.teams.length
      };
    } else {
      // Try getting leagues for this sport
      return await getSportLeagues(category, page, pageSize);
    }
  } catch (error) {
    console.error(`Error fetching ${category} news:`, error);
    // Try getting leagues for this sport
    return await getSportLeagues(category, page, pageSize);
  }
  */
  
  // Filter fallback news by category
  const fallbackData = getFallbackNewsData();
  
  if (category.toLowerCase() === 'all') {
    return fallbackData;
  }
  
  // Filter articles by category
  const filteredArticles = fallbackData.articles.filter(article => 
    article.category && article.category.toLowerCase() === category.toLowerCase()
  );
  
  return {
    articles: filteredArticles,
    totalArticles: filteredArticles.length
  };
}

// Get leagues for a sport as news
const getSportLeagues = async (category, page = 1, pageSize = 10) => {
  try {
    // Convert category to a format TheSportsDB can use
    const sportName = CATEGORY_SEARCH_MAP[category.toLowerCase()] || category;
    
    // Use TheSportsDB API to get leagues for this sport
    const response = await sportsDbAxios.get('/all_leagues.php');
    
    if (response.data && response.data.leagues && response.data.leagues.length > 0) {
      // Filter leagues by sport
      const sportLeagues = response.data.leagues.filter(league => 
        league.strSport.toLowerCase() === sportName.toLowerCase());
      
      if (sportLeagues.length > 0) {
        // Create news articles from leagues data
        const articles = sportLeagues.slice(0, pageSize).map(league => {
          return {
            title: `${league.strLeague} - ${sportName} League`,
            description: `Latest news and updates about the ${league.strLeague} in ${league.strCountry}.`,
            urlToImage: getRandomSportsImage(category.toLowerCase()),
            source: { name: 'TheSportsDB' },
            publishedAt: new Date().toISOString(),
            content: `The ${league.strLeague} is a professional ${sportName} league in ${league.strCountry}.`,
            url: '#',
            category: category.toLowerCase(),
            isToday: true,
            isRecent: true
          };
        });
        
        return {
          articles: articles,
          totalArticles: sportLeagues.length
        };
      }
    }
    
    // Use fallback data
    return getCategoryFallbackData(category);
  } catch (error) {
    console.error(`Error fetching ${category} leagues:`, error);
    // Use fallback data
    return getCategoryFallbackData(category);
  }
}

// Backup function to get category news
const getBackupCategoryNews = async (category, page = 1, pageSize = 10) => {
  try {
    // Use TheSportsDB API to get teams for this sport
    const response = await sportsDbAxios.get('/search_all_teams.php', {
      params: {
        s: category // Search by sport name
      }
    });
    
    if (response.data && response.data.teams && response.data.teams.length > 0) {
      // Create news articles from teams data
      const articles = response.data.teams.slice(0, pageSize).map(team => {
        return {
          title: `${team.strTeam} - ${category} Team Profile`,
          description: team.strDescriptionEN ? team.strDescriptionEN.substring(0, 200) + '...' : `Latest news about ${team.strTeam}`,
          urlToImage: team.strTeamBadge || team.strTeamJersey || team.strTeamLogo || getRandomSportsImage(category.toLowerCase()),
          source: { name: team.strLeague || 'Sports League' },
          publishedAt: new Date().toISOString(),
          content: team.strDescriptionEN || `${team.strTeam} is a professional ${category} team based in ${team.strCountry}.`,
          url: '#',
          category: category.toLowerCase(),
          isToday: true,
          isRecent: true
        };
      });
      
      return {
        articles: articles,
        totalArticles: response.data.teams.length
      };
    } else {
      // Try getting leagues for this sport
      return await getSportLeagues(category, page, pageSize);
    }
  } catch (error) {
    console.error(`Error fetching backup ${category} news:`, error);
    // Try getting leagues for this sport
    return await getSportLeagues(category, page, pageSize);
  }
}

// Get trending sports news
export const getTrendingNews = async (pageSize = 5) => {
  // Comment out API fetching and return default trending news
  /*
  try {
    // Use TheSportsDB API to get popular teams as trending news
    const response = await sportsDbAxios.get('/search_all_teams.php', {
      params: {
        l: 'NBA' // NBA teams are popular
      }
    });
    
    if (response.data && response.data.teams && response.data.teams.length > 0) {
      // Create trending news from popular teams
      return response.data.teams.slice(0, pageSize).map(team => ({
        title: `${team.strTeam} - Latest Updates`,
        description: team.strDescriptionEN ? team.strDescriptionEN.substring(0, 150) + '...' : `Latest news about ${team.strTeam}`,
        urlToImage: team.strTeamBadge || team.strTeamLogo || getRandomSportsImage('basketball'),
        source: { name: 'TheSportsDB' },
        publishedAt: new Date().toISOString(),
        content: team.strDescriptionEN || `${team.strTeam} is a professional basketball team.`,
        url: '#',
        category: 'basketball',
        isToday: true,
        isRecent: true
      }));
    } else {
      // Try getting trending leagues
      return await getTrendingLeagues(pageSize);
    }
  } catch (error) {
    console.error("Error fetching trending teams:", error);
    // Try getting trending leagues
    return await getTrendingLeagues(pageSize);
  }
  */
  
  // Return default trending news
  const fallbackData = getFallbackNewsData();
  return fallbackData.trending;
}

// Get trending leagues as news
const getTrendingLeagues = async (pageSize = 5) => {
  try {
    // Use TheSportsDB API to get popular leagues
    const response = await sportsDbAxios.get('/all_leagues.php');
    
    if (response.data && response.data.leagues && response.data.leagues.length > 0) {
      // Filter to popular leagues
      const popularLeagues = ['NBA', 'NFL', 'English Premier League', 'La Liga', 'Serie A'];
      const filteredLeagues = response.data.leagues.filter(league => 
        popularLeagues.some(popular => league.strLeague.includes(popular)));
      
      // Create trending news from popular leagues
      return filteredLeagues.slice(0, pageSize).map(league => ({
        title: `${league.strLeague} - Latest Updates`,
        description: `Latest news and updates from the ${league.strLeague}.`,
        urlToImage: getRandomSportsImage(league.strSport.toLowerCase()),
        source: { name: 'TheSportsDB' },
        publishedAt: new Date().toISOString(),
        content: `The ${league.strLeague} is a professional ${league.strSport} league in ${league.strCountry}.`,
        url: '#',
        category: league.strSport.toLowerCase(),
        isToday: true,
        isRecent: true
      }));
    } else {
      // Use fallback data
      return getFallbackTrendingData();
    }
  } catch (error) {
    console.error("Error fetching trending leagues:", error);
    // Use fallback data
    return getFallbackTrendingData();
  }
}

// Backup function to get trending news
const getBackupTrendingNews = async (pageSize = 5) => {
  try {
    // Use TheSportsDB API to get popular teams as trending news
    const response = await sportsDbAxios.get('/search_all_teams.php', {
      params: {
        l: 'NBA' // NBA teams are popular
      }
    });
    
    if (response.data && response.data.teams && response.data.teams.length > 0) {
      // Create trending news from popular teams
      return response.data.teams.slice(0, pageSize).map(team => ({
        title: `${team.strTeam} - Latest Updates`,
        description: team.strDescriptionEN ? team.strDescriptionEN.substring(0, 150) + '...' : `Latest news about ${team.strTeam}`,
        urlToImage: team.strTeamBadge || team.strTeamLogo || getRandomSportsImage('basketball'),
        source: { name: 'TheSportsDB' },
        publishedAt: new Date().toISOString(),
        content: team.strDescriptionEN || `${team.strTeam} is a professional basketball team.`,
        url: '#',
        category: 'basketball',
        isToday: true,
        isRecent: true
      }));
    } else {
      // Try getting trending leagues
      return await getTrendingLeagues(pageSize);
    }
  } catch (error) {
    console.error("Error fetching backup trending teams:", error);
    // Try getting trending leagues
    return await getTrendingLeagues(pageSize);
  }
}

// Search for sports news
export const searchNews = async (query, page = 1, pageSize = 10) => {
  // Comment out API fetching and return filtered default news
  /*
  try {
    // Use TheSportsDB API to search for teams
    const response = await sportsDbAxios.get('/searchteams.php', {
      params: {
        t: query // Search by team name
      }
    });
    
    if (response.data && response.data.teams && response.data.teams.length > 0) {
      // Create news articles from search results
      const articles = response.data.teams.map(team => {
        const sportCategory = team.strSport ? team.strSport.toLowerCase() : 'sports';
        
        return {
          title: `${team.strTeam} - Team Profile`,
          description: team.strDescriptionEN ? team.strDescriptionEN.substring(0, 200) + '...' : `Latest news about ${team.strTeam}`,
          urlToImage: team.strTeamBadge || team.strTeamJersey || team.strTeamLogo || getRandomSportsImage(sportCategory),
          source: { name: team.strLeague || 'Sports League' },
          publishedAt: new Date().toISOString(),
          content: team.strDescriptionEN || `${team.strTeam} is a professional sports team based in ${team.strCountry}.`,
          url: '#',
          category: sportCategory,
          isToday: true,
          isRecent: true
        };
      });
      
      return {
        articles: articles.slice(0, pageSize),
        totalArticles: response.data.teams.length
      };
    } else {
      // Try searching for players
      return await searchPlayers(query, page, pageSize);
    }
  } catch (error) {
    console.error(`Error searching for teams "${query}":`, error);
    // Try searching for players
    return await searchPlayers(query, page, pageSize);
  }
  */
  
  // Filter fallback news by search query
  const fallbackData = getFallbackNewsData();
  
  // Filter articles by search query
  const filteredArticles = fallbackData.articles.filter(article => {
    const articleText = `${article.title} ${article.description}`.toLowerCase();
    return articleText.includes(query.toLowerCase());
  });
  
  return {
    articles: filteredArticles,
    totalArticles: filteredArticles.length
  };
}

// Search for players
const searchPlayers = async (query, page = 1, pageSize = 10) => {
  try {
    // Use TheSportsDB API to search for players
    const response = await sportsDbAxios.get('/searchplayers.php', {
      params: {
        p: query // Search by player name
      }
    });
    
    if (response.data && response.data.player && response.data.player.length > 0) {
      // Create news articles from player search results
      const articles = response.data.player.map(player => {
        const sportCategory = player.strSport ? player.strSport.toLowerCase() : 'sports';
        
        return {
          title: `${player.strPlayer} - Player Profile`,
          description: player.strDescriptionEN ? player.strDescriptionEN.substring(0, 200) + '...' : `Latest news about ${player.strPlayer}`,
          urlToImage: player.strThumb || player.strCutout || getRandomSportsImage(sportCategory),
          source: { name: player.strTeam || 'Sports Team' },
          publishedAt: new Date().toISOString(),
          content: player.strDescriptionEN || `${player.strPlayer} is a professional ${player.strSport} player from ${player.strNationality}.`,
          url: '#',
          category: sportCategory,
          isToday: true,
          isRecent: true
        };
      });
      
      return {
        articles: articles.slice(0, pageSize),
        totalArticles: response.data.player.length
      };
    } else {
      // Use fallback search data
      return getSearchFallbackData(query);
    }
  } catch (error) {
    console.error(`Error searching for players "${query}":`, error);
    // Use fallback search data
    return getSearchFallbackData(query);
  }
}

// Get search fallback data
const getSearchFallbackData = (query) => {
  // Filter fallback data by search query
  const filteredArticles = FALLBACK_NEWS_DATA.filter(article => {
    const articleText = `${article.title} ${article.description}`.toLowerCase();
    return articleText.includes(query.toLowerCase());
  });
  
  // Use filtered articles if available, otherwise use all fallback data
  const articles = filteredArticles.length > 0 ? filteredArticles : FALLBACK_NEWS_DATA;
  
  // Mark as not today/recent
  articles.forEach(article => {
    article.isToday = false;
    article.isRecent = false;
  });
  
  return {
    articles: articles,
    totalArticles: articles.length
  };
}

// Helper function to determine sport category from text
const determineSportCategory = (text = '') => {
  const lowerText = text.toLowerCase();
  
  // Check for category keywords
  if (lowerText.includes('football') || lowerText.includes('soccer')) {
    return 'football';
  } else if (lowerText.includes('basketball') || lowerText.includes('nba')) {
    return 'basketball';
  } else if (lowerText.includes('cricket')) {
    return 'cricket';
  } else if (lowerText.includes('hockey')) {
    return 'hockey';
  } else if (lowerText.includes('kabaddi')) {
    return 'kabaddi';
  } else if (lowerText.includes('kho kho')) {
    return 'kho - kho';
  }
  
  return 'sports';
};

// Helper function to transform a TheSportsDB team to a news article
const transformTeamToArticle = (team) => {
  const sportCategory = team.strSport ? team.strSport.toLowerCase() : 'sports';
  
  return {
    title: `${team.strTeam} - Team Profile`,
    description: team.strDescriptionEN ? team.strDescriptionEN.substring(0, 200) + '...' : `Latest news about ${team.strTeam}`,
    urlToImage: team.strTeamBadge || team.strTeamJersey || team.strTeamLogo || getRandomSportsImage(sportCategory),
    source: { name: team.strLeague || 'Sports League' },
    publishedAt: new Date().toISOString(),
    content: team.strDescriptionEN || `${team.strTeam} is a professional sports team based in ${team.strCountry}.`,
    url: '#',
    category: sportCategory,
    isToday: true,
    isRecent: true
  };
};

// Helper function to transform a TheSportsDB player to a news article
const transformPlayerToArticle = (player) => {
  const sportCategory = player.strSport ? player.strSport.toLowerCase() : 'sports';
  
  return {
    title: `${player.strPlayer} - Player Profile`,
    description: player.strDescriptionEN ? player.strDescriptionEN.substring(0, 200) + '...' : `Latest news about ${player.strPlayer}`,
    urlToImage: player.strThumb || player.strCutout || getRandomSportsImage(sportCategory),
    source: { name: player.strTeam || 'Sports Team' },
    publishedAt: new Date().toISOString(),
    content: player.strDescriptionEN || `${player.strPlayer} is a professional ${player.strSport} player from ${player.strNationality}.`,
    url: '#',
    category: sportCategory,
    isToday: true,
    isRecent: true
  };
};

// Helper function to transform a TheSportsDB event to a news article
const transformEventToArticle = (event) => {
  const sportCategory = event.strSport ? event.strSport.toLowerCase() : 'sports';
  
  return {
    title: `${event.strEvent} - Upcoming Match`,
    description: `${event.strHomeTeam} vs ${event.strAwayTeam} - ${event.dateEvent} ${event.strTime}`,
    urlToImage: event.strThumb || getRandomSportsImage(sportCategory),
    source: { name: event.strLeague || 'Sports League' },
    publishedAt: new Date().toISOString(),
    content: `Upcoming match between ${event.strHomeTeam} and ${event.strAwayTeam} at ${event.strVenue}. Date: ${event.dateEvent}, Time: ${event.strTime}.`,
    url: '#',
    category: sportCategory,
    isToday: true,
    isRecent: true
  };
};

// Helper function to extract image URL from HTML description
const extractImageFromDescription = (html) => {
  if (!html) return null;
  const imgMatch = html.match(/<img[^>]+src="([^"]+)"/i);
  return imgMatch ? imgMatch[1] : null;
};

// Helper function to strip HTML tags
const stripHtmlTags = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').trim();
};

// Fallback data in case API fails or rate limit is reached
export const getFallbackNewsData = () => {
  // Current date for all news articles
  const today = new Date().toISOString();
  
  return {
    articles: [
      {
        source: { id: "espn", name: "ESPN" },
        author: "ESPN Staff",
        title: "MESSI SHOWS HIS WORTH",
        description: "Leo Barca furious over contract leak. Messi continues to prove his value on the field despite off-field controversies surrounding his Barcelona contract.",
        url: "#",
        urlToImage: "https://i.ibb.co/wgb5Q4B/messi-newspaper.jpg", // Image 1 from user
        publishedAt: today,
        content: "Full article content here...",
        category: "football",
        isToday: true,
        isRecent: true
      },
      {
        source: { id: "india", name: "India Today" },
        author: "Sports Desk",
        title: "TOP 10 TRENDING SPORTS STORIES",
        description: "The latest trending sports stories including cricket team celebrations and tennis upsets dominate headlines this week.",
        url: "#",
        urlToImage: "https://i.ibb.co/XjdnDLF/trending-sports.jpg", // Image 2 from user
        publishedAt: today,
        content: "Full article content here...",
        category: "sports",
        isToday: true,
        isRecent: true
      },
      {
        source: { id: "ipl", name: "IPL" },
        author: "IPL Staff",
        title: "IPL 2025: Top Performers Make Their Mark",
        description: "Star batsmen from Gujarat Titans, Sunrisers Hyderabad and India showcase their talent in the latest IPL matches.",
        url: "#",
        urlToImage: "https://i.ibb.co/QvLVdyL/cricket-players.jpg", // Image 3 from user
        publishedAt: today,
        content: "Full article content here...",
        category: "cricket",
        isToday: true,
        isRecent: true
      },
      {
        source: { id: "sports", name: "Sports News" },
        author: "Sports News Staff",
        title: "SPORTS NEWS LIVE",
        description: "Stay updated with the latest sports news across basketball, football, cricket, boxing and more.",
        url: "#",
        urlToImage: "https://i.ibb.co/YRBvBvv/sports-news-live.jpg", // Image 4 from user
        publishedAt: today,
        content: "Full article content here...",
        category: "sports",
        isToday: true,
        isRecent: true
      },
      {
        source: { id: "athletics", name: "Athletics Federation" },
        author: "Athletics Staff",
        title: "Athletics Federation of India Championships 2025",
        description: "Top Indian athletes compete in the national championships with impressive performances on the track.",
        url: "#",
        urlToImage: "https://i.ibb.co/LQgFhcw/athletics.jpg", // Image 5 from user
        publishedAt: today,
        content: "Full article content here...",
        category: "athletics",
        isToday: true,
        isRecent: true
      },
      {
        source: { id: "espn", name: "ESPN" },
        author: "ESPN Staff",
        title: "NBA Playoffs: Lakers Advance to Conference Finals",
        description: "LeBron James led the Los Angeles Lakers to a decisive Game 7 victory over the Denver Nuggets, securing their spot in the Western Conference Finals.",
        url: "#",
        urlToImage: "https://media.istockphoto.com/id/1309219758/photo/basketball-player-makes-slam-dunk.jpg?s=612x612&w=0&k=20&c=lXkbWzXJGjtkTVwNlA_FEH_dFqQKs7FXGPjrn-KzFHQ=",
        publishedAt: today,
        content: "Full article content here...",
        category: "basketball",
        isToday: true,
        isRecent: true
      },
      {
        source: { id: "skysports", name: "Sky Sports" },
        author: "Sky Sports Staff",
        title: "Premier League Title Race: Manchester City Edges Closer",
        description: "Manchester City secured a crucial 2-0 victory against Arsenal, putting them in pole position to win their fourth consecutive Premier League title.",
        url: "#",
        urlToImage: "https://media.istockphoto.com/id/1320104839/photo/soccer-player-kicks-a-ball.jpg?s=612x612&w=0&k=20&c=IM_0hDhK4zyxrJP4oMNxIQlGLN09TKYuKJ_Jh9DMkZE=",
        publishedAt: today,
        content: "Full article content here...",
        category: "football",
        isToday: true,
        isRecent: true
      },
      {
        source: { id: "starsports", name: "Star Sports" },
        author: "Star Sports Staff",
        title: "Pro Kabaddi League: Jaipur Pink Panthers Extend Winning Streak",
        description: "Defending champions Jaipur Pink Panthers recorded their fifth consecutive victory in the Pro Kabaddi League, defeating Puneri Paltan in a thrilling encounter.",
        url: "#",
        urlToImage: "https://media.istockphoto.com/id/1369257635/photo/kabaddi-player-in-action.jpg?s=612x612&w=0&k=20&c=cYGHVZRYODQwWB_L7iW-CFwwAY8LrWJdYWsI7-hQGwg=",
        publishedAt: today,
        content: "Full article content here...",
        category: "kabaddi",
        isToday: true,
        isRecent: true
      }
    ],
    trending: [
      {
        tag: "#MESSI",
        date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
        title: "Messi shows his worth despite contract controversy",
        image: "https://i.ibb.co/wgb5Q4B/messi-newspaper.jpg", // Image 1 from user
        category: "football",
        isToday: true,
        isRecent: true
      },
      {
        tag: "#IPL2025",
        date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
        title: "Star batsmen shine in latest IPL matches",
        image: "https://i.ibb.co/QvLVdyL/cricket-players.jpg", // Image 3 from user
        category: "cricket",
        isToday: true,
        isRecent: true
      },
      {
        tag: "#Athletics",
        date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
        title: "Athletics Federation of India Championships 2025",
        image: "https://i.ibb.co/LQgFhcw/athletics.jpg", // Image 5 from user
        category: "athletics",
        isToday: true,
        isRecent: true
      }
    ],
  };
};
