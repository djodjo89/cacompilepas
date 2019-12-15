import React, {ReactNode} from "react";
import CourseSheet from "./CourseSheet";

class CourseSheets extends React.Component<{ id: string, courseSheets: [], className: string }, { courseSheets: [] }> {

    public constructor(props: any) {
        super(props);
        this.renderCourseSheets = this.renderCourseSheets.bind(this);
        this.renderCourseSheet = this.renderCourseSheet.bind(this);
    }

    public renderCourseSheet(i: string, title: string, publication_date: string, link: string, description: string): ReactNode {
        return <CourseSheet key={i} title={title} publication_date={publication_date} link={link}
                            description={description}/>;
    }

    public renderCourseSheets(): ({} | null | undefined)[] {
        // @ts-ignore
        if (undefined === this.props.courseSheets['is_empty']) {
            let res = [], i = 0;
            for (let courseSheet of this.props.courseSheets) {
                res.push(this.renderCourseSheet(i.toString(), courseSheet['title'], courseSheet['publication_date'], courseSheet['link'], courseSheet['description']));
                i++;
            }
            return res;
        } else {
            return [];
        }
    }

    public render(): ReactNode {
        return (
            <div className={'course-sheets-section' + this.props.className}>
                {this.renderCourseSheets()}
            </div>
        )
    }
}

export default CourseSheets;
