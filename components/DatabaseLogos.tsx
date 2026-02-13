import Image from 'next/image';
import React from 'react';

export const databaseLogos = [
    {
        name: 'PostgreSQL',
        color: '#336791',
        logo: (props: any) => (
            <div className="relative w-full h-full">
                <Image src="/postgres.svg" alt="PostgreSQL" fill className="object-contain" />
            </div>
        ),
    },
    {
        name: 'MySQL',
        color: '#4479A1',
        logo: (props: any) => (
            <div className="relative w-full h-full">
                <Image src="/mysql.svg" alt="MySQL" fill className="object-contain" />
            </div>
        ),
    },
    {
        name: 'SQLite',
        color: '#003B57',
        logo: (props: any) => (
            <div className="relative w-full h-full">
                <Image src="/sqlite.svg" alt="SQLite" fill className="object-contain" />
            </div>
        ),
    },
];
