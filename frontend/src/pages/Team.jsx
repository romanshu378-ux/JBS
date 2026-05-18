import { useState, useEffect } from 'react';
import { Linkedin, Mail } from 'lucide-react';
import API, { BASE_URL } from '../api';

const Team = () => {

  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchTeam = async () => {

      try {

        const { data } = await API.get('/team');

        setTeamMembers(data.data || []);

      } catch (error) {

        console.error('Error fetching team members:', error);

      } finally {

        setLoading(false);

      }

    };

    fetchTeam();

  }, []);

  return (

    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">

      <div className="container mx-auto px-4">

        <h1 className="text-4xl md:text-5xl font-heading font-bold text-corporateBlue mb-4 text-center">
          Meet Our Leadership
        </h1>

        <p className="text-lg text-slate-600 max-w-2xl mx-auto text-center mb-16">
          The driving force behind Janki Ballabh Services' success and commitment to excellence.
        </p>

        {loading ? (

          <div className="text-center py-12 text-slate-600 text-xl font-medium">
            Loading Team...
          </div>

        ) : teamMembers.length === 0 ? (

          <div className="text-center py-12 text-slate-600 text-xl font-medium">
            No team members found.
          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">

            {teamMembers.map((member, index) => (

              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group"
              >

                <div className="h-80 overflow-hidden relative">

                  <img
                    src={member.image ? `${BASE_URL}${member.image.replace(/\\/g, '/')}` : 'https://via.placeholder.com/400x400?text=No+Image'}
                    alt={member.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src =
                        'https://via.placeholder.com/400x400?text=No+Image';
                    }}
                  />

                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-corporateBlue to-transparent h-1/2 opacity-60"></div>

                  <div className="absolute bottom-4 left-0 w-full flex justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">

                    <button className="bg-white/20 p-2 rounded-full hover:bg-corporateGold text-white transition-colors backdrop-blur-sm">
                      <Linkedin size={18} />
                    </button>

                    <button className="bg-white/20 p-2 rounded-full hover:bg-corporateGold text-white transition-colors backdrop-blur-sm">
                      <Mail size={18} />
                    </button>

                  </div>

                </div>

                <div className="p-6 text-center border-t-4 border-corporateGold">

                  <h3 className="text-2xl font-bold text-corporateBlue mb-1">
                    {member.name}
                  </h3>

                  <p className="text-slate-500 font-medium">
                    {member.role}
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );

};

export default Team;