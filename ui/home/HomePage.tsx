import Form from "components/FormApp";
import UnderConstruction from "components/UnderConstruction";
import { NextPage } from "next";
import styles from './HomePage.module.scss'


const HomePage:NextPage = () => {
  return (<>
    <UnderConstruction messageType="underconstruction"/>
  </>
  )
}

export const getStaticProps = async () => {
  return {
    props: {
      userName: "Jose",
    },
  }
}

export default HomePage