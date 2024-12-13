import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Kiểm tra xem URL có phải là từ Grab Food không
    if (!url.includes('food.grab.com')) {
      return NextResponse.json(
        { error: 'Only Grab Food URLs are supported' },
        { status: 400 }
      );
    }

    console.log('Crawling URL:', url);

    // Thêm headers để giả lập trình duyệt
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Cache-Control': 'max-age=0',
      'TE': 'Trailers',
      'Referer': 'https://food.grab.com'
    };

    const response = await axios.get(url, {
      headers: headers,
      timeout: 10000,
    });

    console.log('Response status:', response.status);
    console.log('Response data length:', response.data.length);

    const $ = cheerio.load(response.data);
    const menuItems: any[] = [];

    // Cập nhật selectors theo cấu trúc HTML mới nhất của Grab
    $('.menuItem___1HHmD').each((index, element) => {
      const name = $(element).find('.itemNameTitle___1sFBq').text().trim();
      const description = $(element).find('.itemDescription___2cIzt').text().trim();
      const price = $(element).find('.discountedPrice___3MBVA').text().trim();
      const imageUrl = $(element).find('img.realImage___2TyNE').attr('src');

      if (name) {
        menuItems.push({
          name,
          description,
          price: price || 'Liên hệ',
          imageUrl: imageUrl || '',
        });
      }
    });

    console.log('Found items:', menuItems.length);

    return NextResponse.json({ 
      menuItems,
      debug: {
        itemsFound: menuItems.length,
        htmlLength: response.data.length,
        status: response.status
      }
    });
  } catch (error: any) {
    console.error('Crawl error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    return NextResponse.json(
      { 
        error: 'Failed to fetch menu data',
        details: error.message,
        status: error.response?.status,
        headers: error.response?.headers
      },
      { status: 500 }
    );
  }
} 