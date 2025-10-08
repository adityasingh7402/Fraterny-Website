import HeroArchetype from '../components/archeotype/HeroArcheotype';
import MainArchetype from './archeotype/MainArcheotype';
import ScrollStackArchetype from './archeotype/ScrollStackArchetype';

export default function PlatformTest() {
  return (
    <>
      <div className="bg-gray-900">
        <HeroArchetype />
      </div>
      <div className="bg-white">
        {/* <MainArchetype /> */}
        <ScrollStackArchetype />
      </div>
    </>
  );
}